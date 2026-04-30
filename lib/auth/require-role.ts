// lib/auth/require-role.ts

import { getSession } from "./get-session";

export type UserRole = "landlord" | "tenant" | "superadmin";


// Reusable role guard for API routes and Server Components.
// Throws if no session exists or if the user's role is not allowed.
 
export async function requireRole(allowedRoles: UserRole[]) {
  const authData = await getSession();

  if (!authData) {
    throw new Error("Unauthorized: No active session");
  }

  const userRole = (authData.user.role as UserRole) || "tenant";

  if (!allowedRoles.includes(userRole)) {
    throw new Error(
      `Forbidden: Required role ${allowedRoles.join(" or ")}, but user has ${userRole}`,
    );
  }

  return authData;
}


// Convenience guard for landlord-only routes.
// Throws if the user is not authenticated or not a landlord.

export async function requireLandlord() {
  return requireRole(["landlord"]);
}


// Convenience guard for superadmin-only routes.
// Throws if the user is not authenticated or not a superadmin.

export async function requireSuperadmin() {
  return requireRole(["superadmin"]);
}


// Convenience guard for tenant or landlord routes.
// Throws if the user is not authenticated.

export async function requireAuthenticated() {
  return requireRole(["landlord", "tenant", "superadmin"]);
}
