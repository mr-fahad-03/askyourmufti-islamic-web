"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/admin/AdminAuthProvider";
import { Lock, Mail, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";

export default function AdminLoginPage() {
    const { login, loading: authLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSubmitting(true);
        const result = await login(email, password);
        if (!result.ok) {
            setError(result.message || "Invalid credentials");
        }
        setSubmitting(false);
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <Loader2 size={32} className="animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            {/* Background decorations */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/[0.03] rounded-full -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/[0.04] rounded-full translate-y-1/3 -translate-x-1/4" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/[0.02] rounded-full" />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo / Brand */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl shadow-lg shadow-primary/20 mb-5">
                        <Lock size={28} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-zinc-900 tracking-tight">
                        ARCHIVE<span className="text-accent">.</span>ADMIN
                    </h1>
                    <p className="text-zinc-500 text-sm mt-2">
                        Sign in to manage your Islamic archive
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200/50 p-8">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                                <AlertCircle size={16} className="flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-zinc-700">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@archive.tm"
                                    required
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-400"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-zinc-700">
                                Password
                            </label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-zinc-300 bg-white text-zinc-900 focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all placeholder:text-zinc-400"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-light transition-colors shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-xs text-zinc-400 mt-8">
                    Archive.TM &mdash; Authorized personnel only
                </p>
            </div>
        </div>
    );
}


