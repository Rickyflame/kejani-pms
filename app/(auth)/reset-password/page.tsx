"use client";

import type React from "react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (!token) {
            toast.error("Invalid or expired reset token.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.resetPassword({
                newPassword: password,
                token,
            });

            if (error) {
                toast.error(error.message || "Failed to reset password.");
                return;
            }

            toast.success("Password reset successfully!");
            router.push("/sign-in");
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
                    New Password
                </CardTitle>
                <CardDescription className="text-white/70">
                    Enter your new password below
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                {!token ? (
                    <div className="text-center space-y-4">
                        <p className="text-red-300">
                            Invalid or missing reset token.
                        </p>
                        <Link
                            href="/forgot-password"
                            className="text-blue-300 hover:underline font-medium"
                        >
                            Request a new link
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label
                                htmlFor="password"
                                className="text-sm font-medium text-white"
                            >
                                New Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                minLength={8}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className="border-white/40 bg-white/10 placeholder:text-white/50 text-white py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label
                                htmlFor="confirmPassword"
                                className="text-sm font-medium text-white"
                            >
                                Confirm Password
                            </Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                required
                                minLength={8}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                autoComplete="new-password"
                                className="border-white/40 bg-white/10 placeholder:text-white/50 text-white py-3 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full font-bold py-5 transition-all duration-300 hover:opacity-90"
                            style={{ backgroundColor: "#0C115B", color: "white" }}
                            disabled={loading}
                        >
                            {loading ? "Resetting..." : "Reset Password"}
                        </Button>

                        <p className="text-center text-sm text-white/70">
                            <Link
                                href="/sign-in"
                                className="text-blue-300 hover:underline font-medium"
                            >
                                Back to sign in
                            </Link>
                        </p>
                    </form>
                )}
            </CardContent>
        </Card>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense
            fallback={
                <Card
                    className="w-full shadow-2xl border-transparent p-8"
                    style={{
                        background: "rgba(255, 255, 255, 0.25)",
                        backdropFilter: "blur(40px) saturate(250%)",
                    }}
                >
                    <div className="text-center text-white">Loading...</div>
                </Card>
            }
        >
            <ResetPasswordForm />
        </Suspense>
    );
}