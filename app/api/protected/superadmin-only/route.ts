// app/api/protected/superadmin-only/route.ts

import { requireSuperadmin } from "@/lib/auth/require-role";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authData = await requireSuperadmin();

    return NextResponse.json({
      message: "Superadmin access granted",
      userId: authData.user.id,
      role: authData.user.role,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Forbidden";
    const status = message.includes("Unauthorized") ? 401 : 403;
    return NextResponse.json({ error: message }, { status });
  }
}
