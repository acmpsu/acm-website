import { revalidatePath } from "next/cache";

import { createMcpHandler } from "@/lib/mcp/http";
import { backendForToken } from "@/lib/mcp/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const handle = createMcpHandler({
  configured: isSupabaseConfigured,
  backend: backendForToken,
  onCreated: () => {
    revalidatePath("/events");
    revalidatePath("/");
  },
});

export const POST = handle;
export const GET = handle;
export const DELETE = handle;
