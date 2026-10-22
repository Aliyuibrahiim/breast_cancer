"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, User, Loader2, ArrowRight, Shield, ShieldCheck } from "lucide-react";

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        setErrors({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            message: ""
        });

        let hasError = false;
        const newErrors = {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            message: "",
        };

        if (!formData.name) {
            newErrors.name = "Name is Required";
            hasError = true;
        }

        if (!formData.email) {
            newErrors.email = "Email is Required";
            hasError = true;
        }

        if (!formData.password) {
            newErrors.password = "Password is Required";
            hasError = true;
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Confirm password is Required"
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrors(prev => ({ ...prev, message: "Passwords do not match." }))
            setLoading(false);
            return;
        }

        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(formData.password)) {
            setErrors(prev => ({ ...prev, message: "Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character (@$!%*?&)." }));
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setFormData({ name: "", email: "", password: "", confirmPassword: "" });
            } else {
                setErrors(prev => ({
                    ...prev,
                    message: data.message
                }));
            }
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                message: "An unexpected error occurred."
            }));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-[#00684A] transition-colors">
                            <User size={18} />
                        </div>
                        <input
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 outline-none transition-all duration-200 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#00684A] focus:ring-[#00684A]/20'}`}
                            placeholder="Dr. Aliyu Ibrahim"
                        />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

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
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
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

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400 group-focus-within:text-[#00684A] transition-colors">
                            <Lock size={18} />
                        </div>
                        <input
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`block w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-gray-900 placeholder:text-gray-500 focus:ring-2 outline-none transition-all duration-200 tracking-widest ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-[#00684A] focus:ring-[#00684A]/20'}`}
                            placeholder="••••••••"
                        />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>

                {errors.message && (
                    <div className="bg-red-50 p-3 rounded-lg border border-red-100 text-red-600 text-sm font-medium text-center">
                        {errors.message}
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
                    {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                        <>
                            Sign Up <ArrowRight size={18} />
                        </>
                    )}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-gray-600 font-medium">
                    Already have an account?{" "}
                    <Link href="/login" className="text-[#00684A] hover:text-[#004d36] transition-colors">
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative">

            <div className="flex-1 flex flex-col justify-center items-center w-full mt-12">
                {/* The Card */}
                <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 w-full max-w-[420px] p-8 sm:p-10 relative z-10">

                    <div className="flex flex-col items-center mb-8 text-center">
                        <div className="w-12 h-12 bg-[#E6F0EC] rounded-full flex items-center justify-center mb-4">
                            <div className="w-1.5 h-1.5 bg-[#00684A] rounded-full opacity-50 relative -top-1 -right-1"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-[#00684A] tracking-tight">OncoVision AI</h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">Create Account</p>
                    </div>

                    <RegisterForm />
                </div>
            </div>
        </div>
    );
}