"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, Shield, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setEmail(""); // clear the input
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative">

            {/* Header / Logo */}
            {/* 
                <div className="w-full max-w-7xl absolute top-0 left-0 p-6 sm:p-8">
                    <h1 className="text-2xl font-bold text-[#00684A] tracking-tight">OncoInsight AI</h1>
                </div>
            */}
            <div className="flex-1 flex flex-col justify-center items-center w-full mt-12">
                {/* The Card */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-[420px] p-8 sm:p-10 relative z-10">

                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-12 h-12 bg-[#E6F0EC] rounded-full flex items-center justify-center mb-4">
                            <div className="w-1.5 h-1.5 bg-[#00684A] rounded-full opacity-50 relative -top-1 -right-1"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-[#00684A] tracking-tight">OncoRisk AI</h2>
                        <h3 className="text-1xl font-bold text-[#00684A] tracking-tight"></h3>
                        <p className="text-gray-500 text-sm font-medium mt-1">Reset Password</p>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-[#00684A] transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 focus:ring-[#00684A]/20 focus:border-[#00684A] sm:text-sm transition-all duration-200 outline-none"
                                    placeholder="email@shika.com"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-600 text-sm font-medium text-center">
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-emerald-800 text-sm font-medium text-center">
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center items-center gap-2 rounded-lg bg-[#00684A] hover:bg-[#00543b] px-4 py-3 text-sm font-bold text-white transition-all duration-200 disabled:opacity-70 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "SEND RESET LINK"}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#00684A] transition-colors">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
