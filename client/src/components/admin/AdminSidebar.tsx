"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Video,
    MessageSquareQuote,
    Tags,
    Search,
    Users,
    Heart,
    Inbox,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/admin/AdminAuthProvider";

const NAV_ITEMS = [
    { href: "/islamic-admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/islamic-admin/sessions", label: "Sessions", icon: Video },
    { href: "/islamic-admin/qa", label: "Q&A Manager", icon: MessageSquareQuote },
    { href: "/islamic-admin/asked-questions", label: "Asked Questions", icon: Inbox },
    // { href: "/islamic-admin/upload", label: "Bulk Upload", icon: Upload },
    { href: "/islamic-admin/topics", label: "Topics", icon: Tags },
    { href: "/islamic-admin/seo", label: "SEO Settings", icon: Search },
    { href: "/islamic-admin/donations", label: "Donations", icon: Heart },
    { href: "/islamic-admin/users", label: "Users", icon: Users },
];

export const AdminSidebar = () => {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-zinc-200 flex flex-col z-40">
            <div className="h-16 flex items-center px-6 border-b border-zinc-200">
                <Link href="/islamic-admin" className="text-xl font-serif font-bold text-primary tracking-tight">
                    ARCHIVE<span className="text-accent">.</span>ADMIN
                </Link>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium",
                                isActive
                                    ? "bg-primary/10 text-primary"
                                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                            )}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-200">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium text-red-600 hover:bg-red-50"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

