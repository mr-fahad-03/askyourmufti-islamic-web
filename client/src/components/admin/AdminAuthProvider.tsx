"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AdminUser {
    id: string;
    email: string;
    role: string;
    name: string;
}

interface AuthContextType {
    user: AdminUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => ({ ok: false }),
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    // Hydrate from localStorage
    useEffect(() => {
        try {
            const stored = localStorage.getItem("admin_user");
            if (stored) {
                setUser(JSON.parse(stored));
            }
        } catch {
            /* ignore */
        }
        setLoading(false);
    }, []);

    // Redirect logic
    useEffect(() => {
        if (loading) return;
        const isLoginPage = pathname === "/islamic-admin/login";
        if (!user && !isLoginPage) {
            router.replace("/islamic-admin/login");
        }
        if (user && isLoginPage) {
            router.replace("/islamic-admin");
        }
    }, [user, loading, pathname, router]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });
            const data = await res.json();

            if (!res.ok) {
                return { ok: false, message: data.message || "Login failed" };
            }

            const adminUser: AdminUser = {
                id: data.id,
                email: data.email,
                role: data.role,
                name: data.name,
            };
            localStorage.setItem("admin_user", JSON.stringify(adminUser));
            setUser(adminUser);
            return { ok: true };
        } catch {
            return { ok: false, message: "Network error. Is the server running?" };
        }
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem("admin_user");
        setUser(null);
        router.replace("/islamic-admin/login");
    }, [router]);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}
