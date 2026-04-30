// app/api/auth/[...all]/route.ts
import { auth } from "@/lib/auth/auth";
import { NextRequest } from "next/server";

const handler = (request: NextRequest) => auth.handler(request);

export { handler as GET, handler as POST };
