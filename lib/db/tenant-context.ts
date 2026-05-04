// lib/db/tenant-context.ts
// ─────────────────────────────────────────────────────────────────────────
// ARCHITECTURAL DECISION (documented — see Charter Risk #2 contingency):
//
// The set_config('app.organisation_id', ...) + current_setting() RLS pattern
// is unreliable with Supabase's transaction pooler (port 6543). PgBouncer
// in transaction mode does not guarantee session variable persistence across
// pooled connections, making set_config silently ineffective.
//
// RESOLUTION (Charter Risk #2 fallback):
// - Primary isolation: explicit WHERE organisation_id = $1 in every query
// - Secondary defence: set_config is still called (best-effort) so that RLS
//   policies fire correctly if the connection mode ever changes (e.g., direct
//   connection, session pooler, or future Supabase pooler improvements)
//
// USAGE — every API route that touches business tables must follow this pattern:
//
//   const result = await withTenantContext(orgId, async (orgId) => {
//     return db.select()
//       .from(properties)
//       .where(eq(properties.organisation_id, orgId));  // <-- mandatory
//   });
// ─────────────────────────────────────────────────────────────────────────

import { sql } from "drizzle-orm";
import { db } from "@/db";

export async function withTenantContext<T>(
  organisationId: string,
  callback: (orgId: string) => Promise<T>,
): Promise<T> {
  // Best-effort: attempt set_config for RLS as defence-in-depth.
  // This is harmless if it fails or is ignored by the pooler.
  try {
    await db.execute(
      sql`SELECT set_config('app.organisation_id', ${organisationId}, false)`,
    );
  } catch {
    // Swallow — application-layer WHERE clause is the primary control.
  }

  return callback(organisationId);
}
