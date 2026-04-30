"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/forget-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    redirectTo: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000"
                        }/reset-password`,
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => ({ message: "Failed to send reset email" }));
                // If endpoint is not available (404), show user-friendly message
                if (res.status === 404) {
                    toast.error("Password reset is not configured yet. Please contact support.");
                    return;
                }
                toast.error(err.message || "Failed to send reset email.");
                return;
            }

            setSent(true);
            toast.success("Reset link sent! Check your email.");
        } catch (err) {
            toast.error("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card
            className="w-full shadow-2xl border-transparent"
            style={{
                background: "rgba(255, 255, 255, 0.25)",
                backdropFilter: "blur(40px) saturate(250%)",
                WebkitBackdropFilter: "blur(40px) saturate(250%)",
                border: "1px solid rgba(255, 255, 255, 0.4)",
                boxShadow:
                    "0 32px 80px rgba(0, 0, 0, 0.3), 0 16px 64px rgba(255, 255, 255, 0.2), inset 0 3px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.3)",
            }}
        >
            <CardHeader className="text-center space-y-2">
                <CardTitle className="text-3xl font-bold text-white">
                    Reset Password
                </CardTitle>
                <CardDescription className="text-white/70">
                    Enter your email and we&apos;ll send you a reset link
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {sent ? (
                    <div className="text-center space-y-4">
                        <div
                            className="mx-auto w-16 h-16 rounded-full flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.15)" }}
                        >
                            <svg
                                className="w-8 h-8 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <p className="text-white">
                            Check your inbox for a password reset link.
                        </p>
                        <Link
                            href="/sign-in"
                            className="text-blue-300 hover:underline font-medium"
                        >
                            Back to sign in
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email"
                                className="text-sm font-medium text-white"
                            >
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                autoComplete="email"
                                className="border-white/40 bg-white/10 placeholder:text-white/50 text-white py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-bold py-5 transition-all duration-300 hover:opacity-90"
                            style={{ backgroundColor: "#0C115B", color: "white" }}
                            disabled={loading}
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </Button>

                        <p className="text-center text-sm text-white/70">
                            Remember your password?{" "}
                            <Link
                                href="/sign-in"
                                className="text-blue-300 hover:underline font-medium"
                            >
                                Sign in
                            </Link>
                        </p>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}