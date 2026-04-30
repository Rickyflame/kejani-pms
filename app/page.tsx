import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default async function Home() {
  const authData = await auth.api.getSession({
    headers: await headers(),
  });

  const user = authData?.user;
  const sessionInfo = authData?.session;

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-8"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e3a8a 75%, #0f172a 100%)",
      }}
    >
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          KEJANI PMS
        </h1>
        <p className="text-lg text-white/60">
          Week 1 · Day 4 — Authentication Flows Active
        </p>
      </div>

      {authData ? (
        <div
          className="flex flex-col items-center gap-4 rounded-2xl p-8 max-w-sm w-full"
          style={{
            background: "rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            boxShadow: "0 32px 80px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div className="text-center space-y-1">
            <p className="text-white text-lg">
              Signed in as{" "}
              <span className="font-semibold">{user?.name}</span>
            </p>
            <p className="text-xs text-white/40 font-mono">
              Org: {sessionInfo?.activeOrganizationId || "None"}
            </p>
          </div>
          <form
            action={async () => {
              "use server";
              await auth.api.signOut({
                headers: await headers(),
              });
              redirect("/sign-in");
            }}
          >
            <Button
              variant="outline"
              type="submit"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white"
            >
              Sign Out
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/sign-in">
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 hover:text-white"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button
              size="lg"
              className="font-bold"
              style={{ backgroundColor: "#0C115B", color: "white" }}
            >
              Get Started
            </Button>
          </Link>
        </div>
      )}
    </main>
  );
}
