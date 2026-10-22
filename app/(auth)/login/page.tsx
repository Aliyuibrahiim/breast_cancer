"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Loader2, ShieldCheck, ArrowRight, Shield } from "lucide-react";


function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verified = searchParams.get("verified");

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        message: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setErrors({
            email: "",
            password: "",
            message: ""
        });

        let hasError = false;
        const newErrors = {
            email: " ",
            password: "",
            message: ""
        };

        if (!formData.email) {
            newErrors.email = "Email is required."
            hasError = true;
        }

        if (!formData.password) {
            newErrors.password = "Password is required"
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                router.push("/dashboard");
            } else {
                setErrors(prev => ({ ...prev, message: data.message }));
            }
        } catch (err) {
            setErrors(prev => ({ ...prev, message: "An unexpected error occurred." }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form className="space-y-5" onSubmit={handleSubmit}>

                {verified && (
                    <div className="flex items-start gap-3 bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-emerald-800 text-sm font-medium">
                        <ShieldCheck size={20} className="shrink-0" />
                        <p>Email successfully verified! You can now log in.</p>
                    </div>
                )}

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Email</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-[#00684A] transition-colors">
                            <Mail size={18} />
                        </div>
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 outline-none transition-all duration-200 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#00684A] focus:ring-[#00684A]/20'}`}
                            placeholder="email@shika.com"
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-sm font-bold text-gray-700">Password</label>
                        <Link href="/forgot-password" className="text-xs font-bold text-[#00684A] hover:text-[#004d36] transition-colors">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-[#00684A] transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 outline-none transition-all duration-200 tracking-widest ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#00684A] focus:ring-[#00684A]/20'}`}
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                {errors.message && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-600 text-sm font-medium text-center">
                        {errors.message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center items-center gap-2 rounded-lg bg-[#00684A] hover:bg-[#00543b] px-4 py-3 text-sm font-bold text-white transition-all duration-200 disabled:opacity-70 mt-4"
                >
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                        <>
                            Sign In <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 font-medium">
                    New staff member?{" "}
                    <Link href="/register" className="text-[#00684A] hover:text-[#004d36] transition-colors">
                        Sign Up
                    </Link>
                </p>
            </div>

            {/* 
            <div className="mt-8 pt-6 flex justify-center gap-4 border-t border-gray-100">
                <div className="flex items-center gap-1.5 bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                    <ShieldCheck size={14} className="text-[#00684A]" />
                    <span className="text-slate-600">HIPAA<br />Compliant</span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#EEF2FF] text-[10px] font-bold uppercase tracking-wide px-3 py-1.5 rounded-full">
                    <span className="text-slate-600">AES-256<br />Encrypted</span>
                </div>
            </div>
            */}
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative">

            {/* Header / Logo */}
            {/* <div className="w-full max-w-7xl absolute top-0 left-0 p-6 sm:p-8">
                <h1 className="text-2xl font-bold text-[#00684A] tracking-tight">OncoInsight AI</h1>
            </div> */}

            <div className="flex-1 flex flex-col justify-center items-center w-full mt-12">
                {/* The Card */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-[420px] p-8 sm:p-10 relative z-10">

                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-12 h-12 bg-[#E6F0EC] rounded-full flex items-center justify-center mb-4">
                            <div className="w-1.5 h-1.5 bg-[#00684A] rounded-full opacity-50 relative -top-1 -right-1"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-[#00684A] tracking-tight">OncoVision AI</h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">Authorized Clinical Access Only</p>
                    </div>

                    <Suspense fallback={<div className="flex justify-center py-10"><Loader2 className="animate-spin text-[#00684A] h-8 w-8" /></div>}>
                        <LoginForm />
                    </Suspense>
                </div>

                {/* Bottom Security Note */}
                {/*
                <div className="mt-8 max-w-[420px] flex items-start gap-2 px-2">
                    <Shield className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed text-gray-500 font-medium">
                        Your session is monitored for security compliance. Unauthorized access attempts are logged and reported to the Institutional IT Department.
                    </p>
                </div>
                */}
            </div>
        </div>
    );
}
