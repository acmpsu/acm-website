"use client";

import { useActionState, useState } from "react";

import { createAgentToken, revokeAgentToken, type TokenState } from "./actions";

export type AgentToken = { id: string; label: string; created_at: string; expires_at: string; revoked_at: string | null };
const empty: TokenState = {};
const button = "inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--navy)] px-4 text-sm font-semibold text-[var(--navy)] hover:bg-[var(--bg-alt)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--navy)] disabled:cursor-not-allowed disabled:opacity-50";

function Feedback({ state }: { state: TokenState }) {
  return state.error ? <p role="alert" className="text-sm font-semibold">{state.error}</p>
    : state.message ? <p role="status" className="text-sm">{state.message}</p> : null;
}

function RevokeToken({ token }: { token: AgentToken }) {
  const [state, action, pending] = useActionState(revokeAgentToken, empty);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="token_id" value={token.id} />
      <button className={button} disabled={pending} aria-label={`Revoke ${token.label}`}>
        {pending ? "Revoking…" : "Revoke access"}
      </button>
      <Feedback state={state} />
    </form>
  );
}

export function AgentTokenPanel({ tokens }: { tokens: AgentToken[] }) {
  const [state, action, pending] = useActionState(createAgentToken, empty);
  const [copied, setCopied] = useState(false);
  const [now] = useState(() => Date.now());
  return (
    <div className="space-y-8">
      <form action={action} className="max-w-xl space-y-4" aria-busy={pending}>
        <label htmlFor="agent-label" className="block text-sm font-semibold">Token name <span aria-hidden="true">*</span></label>
        <input id="agent-label" name="label" required aria-required="true" maxLength={80}
          placeholder="My calendar assistant" autoComplete="off"
          className="h-12 w-full rounded-md border border-[var(--border)] bg-white px-4 text-base focus-visible:outline-2 focus-visible:outline-[var(--navy)]" />
        <button disabled={pending} className={`${button} bg-[var(--navy)] text-white hover:bg-[var(--navy-dk)]`}>
          {pending ? "Creating…" : "Create token"}
        </button>
        <Feedback state={state} />
      </form>

      {state.token && (
        <div className="space-y-4 rounded-xl border border-[var(--border)] bg-[var(--bg-alt)] p-6">
          <label htmlFor="new-agent-token" className="block text-sm font-semibold">Your new agent token</label>
          <input id="new-agent-token" type="text" readOnly value={state.token} autoComplete="off" spellCheck={false}
            onFocus={(event) => event.target.select()}
            className="h-12 w-full rounded-md border border-[var(--border)] bg-white px-4 font-mono text-sm focus-visible:outline-2 focus-visible:outline-[var(--navy)]" />
          <p className="text-sm text-[var(--slate)]">Keep this token private. It can publish events as your officer account for 30 days. Revoking it or losing officer status stops access.</p>
          <button type="button" className={button} onClick={async () => {
            try { await navigator.clipboard.writeText(state.token!); setCopied(true); }
            catch { setCopied(false); }
          }}>{copied ? "Copied" : "Copy token"}</button>
        </div>
      )}

      <section aria-labelledby="agent-tokens-heading" className="space-y-4">
        <h3 id="agent-tokens-heading" className="text-xl font-semibold">Your tokens</h3>
        {tokens.length === 0 ? <p className="text-sm text-[var(--slate)]">No agent tokens yet. Create one to connect your calendar assistant.</p> : (
          <ul className="divide-y divide-[var(--border)]">
            {tokens.map((token) => {
              const status = token.revoked_at ? "Revoked" : Date.parse(token.expires_at) <= now ? "Expired" : "Active";
              return <li key={token.id} className="flex flex-wrap items-center justify-between gap-4 py-4">
                <div className="min-w-0 space-y-2">
                  <p className="break-words font-semibold">{token.label} · {status}</p>
                  <p className="text-sm text-[var(--slate)]">Expires {new Date(token.expires_at).toLocaleDateString("en-US", { timeZone: "America/New_York" })}</p>
                </div>
                {status === "Active" && <RevokeToken token={token} />}
              </li>;
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
