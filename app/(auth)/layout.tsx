// app/(auth)/layout.tsx
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <main
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
            style={{
                background:
                    "linear-gradient(135deg, #0f172a 0%, #1e1b4b 25%, #312e81 50%, #1e3a8a 75%, #0f172a 100%)",
            }}
        >
            {/* Subtle dark overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "rgba(0, 0, 0, 0.15)" }}
            />

            {/* Floating glass orbs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full opacity-50 animate-pulse"
                    style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        boxShadow:
                            "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                    }}
                />
                <div
                    className="absolute top-3/4 right-1/4 w-24 h-24 rounded-full opacity-40 animate-pulse"
                    style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        boxShadow:
                            "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                        animationDelay: "1s",
                    }}
                />
                <div
                    className="absolute top-1/2 right-1/3 w-16 h-16 rounded-full opacity-45 animate-pulse"
                    style={{
                        background: "rgba(255, 255, 255, 0.15)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        border: "2px solid rgba(255, 255, 255, 0.3)",
                        boxShadow:
                            "0 8px 32px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
                        animationDelay: "0.5s",
                    }}
                />
            </div>

            {/* Page content (card) */}
            <div className="relative z-10 w-full max-w-md">{children}</div>
        </main>
    );
}