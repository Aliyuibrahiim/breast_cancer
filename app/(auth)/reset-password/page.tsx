"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Activity, Lock, Loader2, ArrowLeft } from "lucide-react";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({ password: "", confirmPassword: "" });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        if (!token) {
            setError("Missing reset token in URL.");
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: formData.password }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setFormData({ password: "", confirmPassword: "" });
                // Optional: redirect to login after a few seconds
                setTimeout(() => router.push("/login"), 3000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center">
                <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium mb-6">
                    Invalid or missing reset token. Please request a new password reset link.
                </div>
                <Link href="/forgot-password" className="inline-flex items-center gap-2 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors">
                    Request New Link
                </Link>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-500 group-focus-within:text-teal-400 transition-colors">
                        <Lock size={18} />
                    </div>
                    <input
                        name="password"
                        type="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-white shadow-inner placeholder:text-neutral-500 focus:border-teal-500/50 focus:bg-black/40 focus:ring-1 focus:ring-teal-500/50 sm:text-sm transition-all duration-300 outline-none"
                        placeholder="New Password"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-500 group-focus-within:text-teal-400 transition-colors">
                        <Lock size={18} />
                    </div>
                    <input
                        name="confirmPassword"
                        type="password"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full rounded-xl border border-white/10 bg-black/20 py-3.5 pl-11 pr-4 text-white shadow-inner placeholder:text-neutral-500 focus:border-teal-500/50 focus:bg-black/40 focus:ring-1 focus:ring-teal-500/50 sm:text-sm transition-all duration-300 outline-none"
                        placeholder="Confirm New Password"
                    />
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-red-400 text-sm font-medium text-center">
                    {error}
                </div>
            )}
            {message && (
                <div className="bg-teal-500/10 p-3 rounded-xl border border-teal-500/20 text-teal-400 text-sm font-medium text-center">
                    {message}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:shadow-[0_0_30px_rgba(45,212,191,0.5)] transition-all duration-300 disabled:opacity-70 mt-6 border border-white/10"
            >
                {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "RESET PASSWORD"}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="relative flex min-h-screen items-center justify-center bg-[#050A10] overflow-hidden">
            {/* ===== Abstract Glowing Orbs in Background ===== */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-600/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 w-full max-w-[420px] p-6 sm:p-8">
                {/* ===== The Frosted Glass Card ===== */}
                <div className="relative rounded-3xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl p-8 sm:p-10">

                    <div className="flex flex-col items-center mb-10 text-center">
                        <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20 mb-4 shadow-[0_0_30px_rgba(45,212,191,0.2)]">
                            <Activity size={32} className="text-teal-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-wide">New Password</h1>
                        <p className="text-neutral-400 text-sm mt-2">Enter your new secure password</p>
                    </div>

                    <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="animate-spin text-teal-400 h-8 w-8" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-teal-400 transition-colors">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
