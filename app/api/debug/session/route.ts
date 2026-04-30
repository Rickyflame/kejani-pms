// app/api/debug/session/route.ts

import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  if (!authData) {
    return NextResponse.json({ error: "No session" }, { status: 401 });
  }

  return NextResponse.json({
    sub: authData.user.id,
    role: authData.user.role,
    organizationId: authData.session.activeOrganizationId,
    email: authData.user.email,
    name: authData.user.name,
    sessionId: authData.session.id,
  });
}
