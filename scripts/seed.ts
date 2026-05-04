// scripts/seed.ts
// Run with: pnpm db:seed
// ─────────────────────────────────────────────────────────────────────────
// Generates: 3 landlords, 3 organisations, 6 tenants, 9 properties,
// 15 leases, 30 payments, 20+ maintenance requests.
// Idempotent: checks for existing rows by seeded UUIDs before inserting.
// ─────────────────────────────────────────────────────────────────────────

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import * as schema from "../db/schema";
import { config } from "dotenv";
config({ path: ".env.local" });

// ── Dev connection (direct --- not pooler --- for scripts) ──────────────
const connectionString =
  process.env.DATABASE_URL!;
const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

// ── Fixed seed IDs (idempotency anchors) ────────────────────────────────
const ORG_IDS = [
  "aaaaaaaa-0001-0000-0000-000000000001",
  "aaaaaaaa-0001-0000-0000-000000000002",
  "aaaaaaaa-0001-0000-0000-000000000003",
];

const LANDLORD_IDS = [
  "bbbbbbbb-0001-0000-0000-000000000001",
  "bbbbbbbb-0001-0000-0000-000000000002",
  "bbbbbbbb-0001-0000-0000-000000000003",
];

async function seed() {
  console.log("🌱 KEJANI seed script starting...");

  // ── 1. Landlords + Organisations ──────────────────────────────────────
  for (let i = 0; i < 3; i++) {
    const orgId = ORG_IDS[i];
    const landlordId = LANDLORD_IDS[i];

    // Check if org already exists (idempotency)
    const existingOrg = await db
      .select({ id: schema.organization.id })
      .from(schema.organization)
      .where(eq(schema.organization.id, orgId));

    if (existingOrg.length === 0) {
      const orgName = `${faker.company.name()} Properties`;
      await db.insert(schema.organization).values({
        id: orgId,
        name: orgName,
        slug: orgName
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, ""),
        createdAt: new Date(), // ← camelCase (was created_at)
      });
      console.log(` ✓ Created org: ${orgName}`);
    } else {
      console.log(` ↩ Org ${orgId} already exists --- skipping.`);
    }

    // Insert landlord user
    const existingUser = await db
      .select({ id: schema.user.id })
      .from(schema.user)
      .where(eq(schema.user.id, landlordId));

    if (existingUser.length === 0) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      await db.insert(schema.user).values({
        id: landlordId,
        name: `${firstName} ${lastName}`,
        email: `landlord${i + 1}@kejani-demo.com`,
        emailVerified: true,
        role: "landlord",
        createdAt: new Date(), // ← camelCase (was created_at)
        updatedAt: new Date(), // ← camelCase (was updated_at)
      });
      console.log(` ✓ Created landlord: landlord${i + 1}@kejani-demo.com`);
    }
  }

  // ── 2. Properties (3 per org = 9 total) ───────────────────────────────
  for (const orgId of ORG_IDS) {
    for (let p = 0; p < 3; p++) {
      await db
        .insert(schema.properties)
        .values({
          organisation_id: orgId,
          name: `${faker.location.street()} Apartments`,
          address: `${faker.location.streetAddress()}, Nairobi`,
          unit_count: faker.number.int({ min: 4, max: 24 }),
        })
        .onConflictDoNothing();
    }
  }
  console.log(" ✓ Properties seeded (3 per org)");

  // ── 3. Tenants (2 per org = 6 total), Leases, Payments, Maintenance ───
  for (let i = 0; i < 3; i++) {
    const orgId = ORG_IDS[i];
    const orgProperties = await db
      .select()
      .from(schema.properties)
      .where(eq(schema.properties.organisation_id, orgId));

    for (let t = 0; t < 2; t++) {
      const tenantId = crypto.randomUUID();
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const tenantEmail = `tenant${i * 2 + t + 1}@kejani-demo.com`;

      await db
        .insert(schema.user)
        .values({
          id: tenantId,
          name: `${firstName} ${lastName}`,
          email: tenantEmail,
          emailVerified: true,
          role: "tenant",
          createdAt: new Date(), // ← camelCase
          updatedAt: new Date(), // ← camelCase
        })
        .onConflictDoNothing();

      const property = orgProperties[t % orgProperties.length];

      // Create lease
      const startDate = faker.date.recent({ days: 180 });
      const endDate = new Date(startDate);
      endDate.setFullYear(endDate.getFullYear() + 1);
      const rentAmount = faker.number.int({ min: 15000, max: 80000 });

      const [lease] = await db
        .insert(schema.leases)
        .values({
          property_id: property.id,
          tenant_user_id: tenantId,
          organisation_id: orgId,
          start_date: startDate.toISOString().split("T")[0],
          end_date: endDate.toISOString().split("T")[0],
          rent_amount: String(rentAmount),
          status: "active",
        })
        .returning();

      // Create 5 monthly payments per lease
      for (let m = 0; m < 5; m++) {
        const dueDate = new Date(startDate);
        dueDate.setMonth(dueDate.getMonth() + m);
        const isPaid = m < 3; // first 3 months paid

        await db.insert(schema.payments).values({
          lease_id: lease.id,
          tenant_user_id: tenantId,
          organisation_id: orgId,
          amount: String(rentAmount),
          due_date: dueDate.toISOString().split("T")[0],
          paid_date: isPaid ? dueDate.toISOString().split("T")[0] : null,
          status: isPaid ? "paid" : "pending",
        });
      }

      // Create 3--4 maintenance requests per tenant
      const reqCount = faker.number.int({ min: 3, max: 4 });
      const statuses: ("pending" | "in-progress" | "resolved")[] = [
        "pending",
        "in-progress",
        "resolved",
      ];

      for (let r = 0; r < reqCount; r++) {
        await db.insert(schema.maintenanceRequests).values({
          property_id: property.id,
          tenant_user_id: tenantId,
          organisation_id: orgId,
          description: faker.lorem.sentence({ min: 6, max: 14 }),
          status: statuses[r % statuses.length],
        });
      }
    }
  }

  console.log(" ✓ Tenants, leases, payments, maintenance requests seeded");
  console.log("🎉 Seed complete.");
  await client.end();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
