// lib/auth/get-session.ts
import { headers } from "next/headers";
import { auth } from "./auth";

//reads the  current better auth session from cookies
//returns null if no valid sessions exist
export async function getSession() {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });
  return authData;
}

/**
 * Convenience type for the session wrapper returned by Better Auth.
 */
export type AuthData = NonNullable<Awaited<ReturnType<typeof getSession>>>;
