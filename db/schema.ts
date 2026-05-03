// db/schema.ts

import {
  pgTable,
  text,
  timestamp,
  boolean,
  index,
  integer,
  uuid,
  date,
  numeric,
  pgEnum,
} from "drizzle-orm/pg-core";

// ── 1. USER
// Core user record. Better Auth manages this table.
// Do NOT rename any column — Better Auth references them by name.
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  role: text("role").notNull().default("landlord"),
});

// ── 2. SESSION
// Active sessions. Better Auth creates and expires these.
export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  activeOrganizationId: text("active_organization_id"),
});

// ── 3. ACCOUNT ──────────────────────────────────────────────
// OAuth provider accounts (also used for email/password credential storage).
export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── 4. VERIFICATION ─────────────────────────────────────────
// Email verification tokens used by Better Auth.
export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── 5. ORGANISATION ─────────────────────────────────────────
// One row per landlord. This is the multi-tenancy boundary.
// All business data (properties, leases, payments) is scoped to an organisation.
export const organization = pgTable("organization", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── 6. MEMBER ───────────────────────────────────────────────
// Joins a user to an organisation with a specific role.
// A landlord is 'owner'; a tenant is 'member'.
export const member = pgTable("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull().default("member"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── 7. INVITATION ───────────────────────────────────────────
// Pending invitations sent by a landlord to a prospective tenant.
export const invitation = pgTable("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull().default("pending"),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── 8. Properties ──────────────────────────────────────────────────────────

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organisation_id: uuid("organisation_id").notNull(),
    name: text("name").notNull(),
    address: text("address").notNull(),
    unit_count: integer("unit_count").notNull().default(1),
    deleted_at: timestamp("deleted_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    orgIdx: index("properties_org_idx").on(table.organisation_id),
  }),
);

// ── Lease status enum ───────────────────────────────────────────────────

export const leaseStatusEnum = pgEnum("lease_status", [
  "active",
  "expired",
  "terminated",
]);

// ──9. Leases ──────────────────────────────────────────────────────────────

export const leases = pgTable(
  "leases",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    property_id: uuid("property_id")
      .notNull()
      .references(() => properties.id),
    tenant_user_id: uuid("tenant_user_id").notNull(),
    organisation_id: uuid("organisation_id").notNull(),
    start_date: date("start_date").notNull(),
    end_date: date("end_date").notNull(),
    rent_amount: numeric("rent_amount", { precision: 12, scale: 2 }).notNull(),
    status: leaseStatusEnum("status").notNull().default("active"),
    created_at: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    orgIdx: index("leases_org_idx").on(table.organisation_id),
    tenantIdx: index("leases_tenant_idx").on(table.tenant_user_id),
    propertyIdx: index("leases_property_idx").on(table.property_id),
  }),
);
