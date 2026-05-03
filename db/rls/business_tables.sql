Step 2: Enable RLS and Create Policies on properties
2.1 Open Supabase SQL Editor
Navigate to your Supabase Dashboard for kejani-dev.
Click SQL Editor in the left sidebar.
Click New query.
2.2 Run the properties RLS block
Paste the following SQL into the editor and click Run:
sql
Copy
-- ── PROPERTIES ──────────────────────────────────────────────────────────

-- Step 1: Enable RLS (no rows accessible by default after this)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Step 2: Org isolation policy
-- Applies to landlords and tenants via the set_config context
CREATE POLICY org_isolation ON properties
FOR ALL
USING (
  organisation_id = current_setting('app.organisation_id', true)::uuid
);

-- Step 3: Superadmin bypass policy
-- The superadmin_readonly role does not exist yet --- this will be created in Week 6.
-- Write the policy now so it is in place when the role is created.
CREATE POLICY superadmin_all ON properties
FOR ALL
TO superadmin_readonly
USING (true);
2.3 Confirm execution
You should see three success messages (one per command). If you see an error about superadmin_readonly not existing, that is normal and expected — PostgreSQL does not validate role existence at policy creation time. The policy simply will not match any connection until the role is created in Week 6.
Step 3: Replicate Policies for leases, payments, and maintenance_requests
Run the following three SQL blocks one at a time (or all together in one query). Replace the table name in each section.
3.1 leases table
sql
Copy
-- ── LEASES ──────────────────────────────────────────────────────────────

ALTER TABLE leases ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_isolation ON leases
FOR ALL
USING (
  organisation_id = current_setting('app.organisation_id', true)::uuid
);

CREATE POLICY superadmin_all ON leases
FOR ALL
TO superadmin_readonly
USING (true);
3.2 payments table
sql
Copy
-- ── PAYMENTS ────────────────────────────────────────────────────────────

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_isolation ON payments
FOR ALL
USING (
  organisation_id = current_setting('app.organisation_id', true)::uuid
);

CREATE POLICY superadmin_all ON payments
FOR ALL
TO superadmin_readonly
USING (true);
3.3 maintenance_requests table
sql
Copy
-- ── MAINTENANCE_REQUESTS ────────────────────────────────────────────────

ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY org_isolation ON maintenance_requests
FOR ALL
USING (
  organisation_id = current_setting('app.organisation_id', true)::uuid
);

CREATE POLICY superadmin_all ON maintenance_requests
FOR ALL
TO superadmin_readonly
USING (true);