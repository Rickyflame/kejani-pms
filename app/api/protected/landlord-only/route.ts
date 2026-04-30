// app/api/protected/landlord-only/route.ts

import { requireLandlord } from "@/lib/auth/require-role";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authData = await requireLandlord();

    return NextResponse.json({
      message: "Landlord access granted",
      userId: authData.user.id,
      organizationId: authData.session.activeOrganizationId,
      role: authData.user.role,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Forbidden";
    const status = message.includes("Unauthorized") ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }
}
