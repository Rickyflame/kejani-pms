CREATE TYPE "public"."maintenance_status" AS ENUM('pending', 'in-progress', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'paid', 'overdue');--> statement-breakpoint
CREATE TABLE "maintenance_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"tenant_user_id" uuid NOT NULL,
	"organisation_id" uuid NOT NULL,
	"description" text NOT NULL,
	"photo_url" text,
	"status" "maintenance_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lease_id" uuid NOT NULL,
	"tenant_user_id" uuid NOT NULL,
	"organisation_id" uuid NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"due_date" date NOT NULL,
	"paid_date" date,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "maintenance_requests" ADD CONSTRAINT "maintenance_requests_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_lease_id_leases_id_fk" FOREIGN KEY ("lease_id") REFERENCES "public"."leases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "maintenance_org_idx" ON "maintenance_requests" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "maintenance_tenant_idx" ON "maintenance_requests" USING btree ("tenant_user_id");--> statement-breakpoint
CREATE INDEX "maintenance_property_idx" ON "maintenance_requests" USING btree ("property_id");--> statement-breakpoint
CREATE INDEX "payments_org_idx" ON "payments" USING btree ("organisation_id");--> statement-breakpoint
CREATE INDEX "payments_lease_idx" ON "payments" USING btree ("lease_id");--> statement-breakpoint
CREATE INDEX "payments_tenant_idx" ON "payments" USING btree ("tenant_user_id");