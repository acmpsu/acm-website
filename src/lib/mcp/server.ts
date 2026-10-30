import "server-only";

import { createClient } from "@supabase/supabase-js";

import { SUPABASE_KEY, SUPABASE_URL } from "../supabase/env";
import { createEventBackend } from "./backend";

export function backendForToken(token: string) {
  // No service-role key: RPCs enforce token scope and officer status in Postgres.
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
          signal: AbortSignal.any([
            AbortSignal.timeout(8000),
            ...(init?.signal ? [init.signal] : []),
          ]),
        }),
    },
  });
  return createEventBackend(async (name, args) => {
    const { data, error } = await supabase.rpc(name, args);
    // supabase-js normalizes aborted fetches into PostgREST errors.
    if (
      error &&
      /TimeoutError|AbortError|timed?\s*out|aborted/i.test(error.message)
    ) {
      return { data: null, error: { code: "57014" } };
    }
    return { data, error };
  }, token);
}
