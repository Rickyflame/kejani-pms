// app/api/protected/authenticated/route.ts

import { requireAuthenticated } from "@/lib/auth/require-role";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authData = await requireAuthenticated();

    return NextResponse.json({
      message: "Authenticated access granted",
      userId: authData.user.id,
      role: authData.user.role,
      organizationId: authData.session.activeOrganizationId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Forbidden";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
