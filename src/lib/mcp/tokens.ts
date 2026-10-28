import { createHash, randomBytes } from "node:crypto";

export function issueToken() {
  return `acm_events_${randomBytes(32).toString("hex")}`;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function readBearer(header: string | null) {
  const match = /^Bearer (acm_events_[a-f0-9]{64})$/i.exec(header ?? "");
  return match?.[1] ?? null;
}
