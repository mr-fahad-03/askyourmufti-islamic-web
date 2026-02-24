"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminAuthProvider, useAuth } from "@/components/admin/AdminAuthProvider";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Loader2 } from "lucide-react";

function AdminShell({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const isLoginPage = pathname === "/islamic-admin/login";

    // Login page — no sidebar, no guard chrome
    if (isLoginPage) {
        return <>{children}</>;
    }

    // Still loading auth
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    // Not authenticated (redirect handled by provider, but show nothing meanwhile)
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    // Authenticated — show sidebar + content
    return (
        <div className="min-h-screen bg-white">
            <AdminSidebar />
            <div className="ml-64">
                {/* Top bar */}
                <header className="h-16 bg-white border-b border-zinc-200 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div />
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {user.name?.charAt(0).toUpperCase() || "A"}
                        </div>
                        <div className="text-sm">
                            <p className="font-semibold text-zinc-900">{user.name || "Admin"}</p>
                            <p className="text-xs text-zinc-400">{user.role}</p>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminAuthProvider>
            <AdminShell>{children}</AdminShell>
        </AdminAuthProvider>
    );
}


