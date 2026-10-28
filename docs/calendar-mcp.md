# Calendar agent integration

The website **hosts** a Streamable HTTP MCP server at `/api/mcp`. An officer can
connect Codex, Claude Code, or another client that supports custom Bearer headers
and ask it to publish calendar events. No model API key is needed by the website.
This is issue #37's calendar workflow; member boarding tickets (#38) are separate.

## Enable the backend

1. Create a Supabase project. Run `supabase/schema.sql` in its SQL editor, then
   `supabase/migrations/202610280001_officer_event_mcp.sql`. The migration is
   additive and re-runnable. Always apply it after the base schema.
2. Add these values to an untracked `.env.local` in this project:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
   ```

   The existing legacy `NEXT_PUBLIC_SUPABASE_ANON_KEY` also works. Do not add a
   service-role key: this integration does not need one.
3. Sign up and confirm an account. Promote an officer in the Supabase SQL editor:

   ```sql
   update public.profiles set is_officer = true where email = 'OFFICER_EMAIL';
   ```

4. Restart the site after configuring environment variables. Sign in, open
   `/dashboard/agents`, and create a named token. It is displayed once, expires
   after 30 days, and can be revoked from that page.
5. Deploy the website over HTTPS for remote agents. For a local agent, run the
   site on `127.0.0.1` and use `http://127.0.0.1:3000/api/mcp`.

Until configured, the public calendar explains that it is being set up, private
pages require login, and MCP fails closed. No sample member credentials or fake
calendar entries are shipped.

## Connect a client

Set `ACM_EVENTS_TOKEN` in the agent process's environment using the new token.
Keep it in private credential storage; do not commit it or paste it into prompts.
These configuration examples contain only a reference to the environment value.
They do not install any software or change global configuration.

### Codex

In a trusted project's `.codex/config.toml`:

```toml
[mcp_servers.acm_events]
url = "https://YOUR_SITE/api/mcp"
bearer_token_env_var = "ACM_EVENTS_TOKEN"
```

See the [official Codex MCP documentation](https://developers.openai.com/codex/mcp).

### Claude Code

In the project's `.mcp.json`:

```json
{
  "mcpServers": {
    "acm-events": {
      "type": "http",
      "url": "https://YOUR_SITE/api/mcp",
      "headers": { "Authorization": "Bearer ${ACM_EVENTS_TOKEN}" }
    }
  }
}
```

See [Claude Code MCP configuration](https://code.claude.com/docs/en/mcp).
Clients that require an OAuth authorization server instead of accepting custom
headers need an OAuth adapter; this endpoint uses manually provisioned tokens.

Example request to your assistant: “Check the ACM calendar for November 10, 2026.
Prepare a Web & Design workshop from 6–7 PM Eastern in Westgate E243, with check-in
code WEB-NOV10, and confirm the details with me before posting.”

## Integration contract

All methods, including initialization and tool discovery, require
`Authorization: Bearer acm_events_…`. Browser cookies are not accepted for agent
access. The transport is stateless; each request gets a separate SDK server and
identity. The SDK handles protocol negotiation, discovery, request validation,
JSON-RPC errors and JSON response transport. Request bodies are limited to 32 KiB.

| Tool | Input | Output / action |
| --- | --- | --- |
| `list_event_options` | None | Eastern timezone, supported categories, committee IDs and names. |
| `list_events` | `from`, `through`: `YYYY-MM-DD` Eastern dates, at most 92 calendar days including both endpoints | `{events, limit: 100}` ordered by start time and ID. Narrow the range when 100 are returned. Empty results are `{events: [], limit: 100}`. |
| `create_event` | Fields below | `{event, created}`. Publishes immediately to the existing events table and revalidates `/events` and the home page. `created: false` means an identical request already succeeded. |

`create_event` accepts:

| Field | Requirement |
| --- | --- |
| `request_id` | UUID; generate once per intended event and reuse unchanged on retries. |
| `title` | Trimmed nonempty text, at most 160 characters. |
| `date` | Real calendar date, `YYYY-MM-DD`, years 2000–2100. |
| `start_time` | `HH:MM`, 24-hour Eastern time. |
| `end_time` | Optional same-day Eastern time, strictly later than start. |
| `location` | Optional nonempty text, at most 240 characters. |
| `category` | Optional `workshop`, `social`, or `gbm`. |
| `committee_id` | Optional ID from `list_event_options`. |
| `checkin_code` | 4–64 letters, numbers or hyphens; unique across events. Share at the event. |

Impossible dates, spring daylight-saving gaps, unknown fields, invalid UUIDs,
categories and committees are rejected. Fall-back ambiguous wall times use the
first occurrence. Overnight events are not supported by this input contract.
Requests and errors are typed in `src/lib/mcp/contracts.ts`; response event fields
are allowlisted and validated. Neither read nor create responses expose check-in
codes, email addresses, profile data, tokens or token hashes.

## Authorization, retries and failures

- Tokens contain 256 random bits. Only a SHA-256 digest is stored. The original
  token is passed over HTTPS to the database, which hashes it for verification;
  the stored digest cannot authenticate a request.
- Every operation rechecks expiry, revocation and the owner's **current** officer
  status inside a database function. No caller-supplied officer ID is trusted.
- Token management uses the browser's validated Supabase session, RLS and column
  grants. Officers can list/revoke only their own tokens. Members cannot update
  `is_officer` or read token digests. Token editing and expiry extension are not
  granted to clients. Revocation serializes with active operations; an operation
  already authorized before revocation can finish.
- Agents can only list event options, read the public calendar and create events.
  They cannot edit/delete events, promote members or change memberships.
- Creation and the retry record commit in the same database transaction. A token
  row lock serializes simultaneous requests. Repeating the same token/request ID
  and normalized payload returns the original event. Reusing the ID with changed
  data, or using an existing check-in code, returns `CONFLICT`. A token rotation
  starts a new retry scope; do not switch tokens to retry an uncertain write.
- Each database fetch has an eight-second timeout, including reading its body.
  Authentication and the tool call are separate bounded operations. There is no
  automatic write retry. On timeout or disconnection the agent must retry with
  the **same** request ID and fields, since the write may already have committed.
- Missing/invalid/expired/revoked/demoted credentials produce HTTP 401. Missing
  configuration or an unavailable authentication service produces HTTP 503.
  Untrusted browser origins produce HTTP 403. Same-origin and origin-less agent
  requests are accepted; browser CORS is not enabled.
- Tool failures return MCP `isError` results with `INVALID_INPUT`, `UNAUTHORIZED`,
  `CONFLICT`, `TIMEOUT`, `UNAVAILABLE`, or `INVALID_RESPONSE`. Logs contain only
  operation names and generic failure categories, not request payloads, tokens
  or database exception messages.
- The dashboard includes loading, empty, pending, success, unauthorized and error
  states. Mutation controls disable while pending. The public calendar distinguishes
  no events from setup/service failures and provides a route loading state.

## Validation and design status

Run `npm test`, `npm run lint` and `npm run build`. Tests include an actual MCP SDK
client and embedded Postgres loaded from the real schema/migration, covering RLS,
column grants, invalid/expired/revoked tokens, demotion, validation, idempotency,
empty and malformed responses, network failures and timeout normalization.

The home page and `/events` share `UpcomingEvents`, implemented from Figma home
frame `50:326`, Events Section `50:560`. Its original background and transparent
cloud artwork are stored in `public/resources/events/`. Typography, rounded top
corners, heading/calendar spacing, and the 40-second cloud motion follow the
design context. Motion is disabled when reduced motion is requested. The calendar
and selected-day mock images are implemented as interactive HTML using the
existing calendar component, so month navigation and event data remain live.
Other home-page sections and the site's existing header/footer are out of scope.
Live Supabase authentication/publishing needs the deployment configuration above.
