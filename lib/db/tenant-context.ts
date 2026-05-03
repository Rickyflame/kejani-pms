// lib/db/tenant-context.ts
// ─────────────────────────────────────────────────────────────────────────
// Injects the current organisation ID into the PostgreSQL session so that
// RLS policies can read it via current_setting('app.organisation_id', true).
//
// Usage (in every API route that touches business tables):
//
// const result = await withTenantContext(session.organisationId, async () => {
//   return db.select().from(properties);
// });
// ─────────────────────────────────────────────────────────────────────────

import { sql } from "drizzle-orm";
import { db } from "@/db"; // adjust path if your db client lives elsewhere

export async function withTenantContext<T>(
  organisationId: string,
  callback: () => Promise<T>,
): Promise<T> {
  // Inject organisation_id into the PostgreSQL session.
  // The third argument (true) makes this setting transaction-scoped:
  // it is automatically cleared when the transaction ends.
  await db.execute(
    sql`SELECT set_config('app.organisation_id', ${organisationId}, true)`,
  );

  return callback();
}
