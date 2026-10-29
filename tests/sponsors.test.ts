import assert from "node:assert/strict";
import { test } from "node:test";

import { activeSponsors, SPONSORS, type Sponsor } from "../src/lib/sponsors";

const sponsor = (id: string, order: number, extra: Partial<Sponsor> = {}): Sponsor => ({
  id, name: id, logoOnDark: `/${id}.png`, order, active: true, ...extra,
});

test("active sponsors are ordered by tier, then display order, and inactive ones are hidden", () => {
  const ids = activeSponsors([
    sponsor("untiered-first", 1),
    sponsor("gold", 5, { tier: "gold" }),
    sponsor("platinum", 9, { tier: "platinum" }),
    sponsor("retired", 0, { active: false }),
    sponsor("untiered-second", 2),
  ]).map((s) => s.id);
  assert.deepEqual(ids, ["platinum", "gold", "untiered-first", "untiered-second"]);
});

test("sponsor data has unique ids and orders, and https websites", () => {
  assert.equal(new Set(SPONSORS.map((s) => s.id)).size, SPONSORS.length);
  assert.equal(new Set(SPONSORS.map((s) => s.order)).size, SPONSORS.length);
  for (const s of SPONSORS) if (s.website) assert.match(s.website, /^https:\/\//);
});
