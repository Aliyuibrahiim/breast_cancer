"use client";

import React, { useState } from "react";
import { updateDoctorProfile, updatePassword } from "@/services/user";
import { useRouter } from "next/navigation";

import { Shield, User, Mail, Save, KeyRound } from "lucide-react";

interface SettingsFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        role: "admin" | "doctor" | null;
    };
}

export default function SettingsForm({ user }: SettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    
    // Profile Form
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
    });

    // Password Form
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordData, setPasswordData] = useState({
        password: "",
        confirmPassword: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage("");
        setErrorMessage("");

        try {
            await updateDoctorProfile(user.id, formData);
            setSuccessMessage("Profile updated successfully.");
            router.refresh();
        } catch (error: any) {
            setErrorMessage(error.message || "An error occurred while updating the profile.");
        } finally {
            setIsLoading(false);
            setTimeout(() => setSuccessMessage(""), 3000);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (passwordData.password !== passwordData.confirmPassword) {
            setPasswordError("Passwords do not match.");
            return;
        }
        
        if (passwordData.password.length < 6) {
            setPasswordError("Password must be at least 6 characters long.");
            return;
        }

        setIsPasswordLoading(true);
        setPasswordMessage("");
        setPasswordError("");

        try {
            await updatePassword(user.id, passwordData.password);
            setPasswordMessage("Password updated successfully.");
            setPasswordData({ password: "", confirmPassword: "" });
        } catch (error: any) {
            setPasswordError(error.message || "An error occurred while updating the password.");
        } finally {
            setIsPasswordLoading(false);
            setTimeout(() => setPasswordMessage(""), 3000);
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <User className="text-[#00684A] dark:text-emerald-400" />
                            Personal Information
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                            Update your account details and email address.
                        </p>
                    </div>
                    <div className="hidden sm:block">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#E8F4F0] dark:bg-emerald-900/20 text-[#00684A] dark:text-emerald-400 text-sm font-semibold border border-[#D1E9E0] dark:border-emerald-900/50 capitalize">
                            <Shield size={14} />
                            {user.role} Account
                        </span>
                    </div>
                </div>
                
                <form onSubmit={handleSubmit} className="p-8">
                    {successMessage && (
                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-[#00684A] dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                            <Shield size={20} />
                            <span className="text-sm font-medium">{successMessage}</span>
                        </div>
                    )}
                    {errorMessage && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-3">
                            <span className="text-sm font-medium">{errorMessage}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label htmlFor="name" className="block text-xs font-bold text-[#00684A] dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <User size={14} /> Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#F4F7FA] dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#00684A] dark:focus:ring-emerald-500/50 text-gray-900 dark:text-white transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-[#00684A] dark:text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                                <Mail size={14} /> Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#F4F7FA] dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#00684A] dark:focus:ring-emerald-500/50 text-gray-900 dark:text-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-slate-800">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-2.5 bg-[#00684A] text-white font-bold rounded-lg hover:bg-[#00543B] transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            <Save size={18} />
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <KeyRound className="text-[#00684A] dark:text-emerald-400" />
                            Security & Password
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                            Manage your password and security settings.
                        </p>
                    </div>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="p-8">
                    {passwordMessage && (
                        <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/30 text-[#00684A] dark:text-emerald-400 rounded-lg border border-emerald-200 dark:border-emerald-800 flex items-center gap-3">
                            <Shield size={20} />
                            <span className="text-sm font-medium">{passwordMessage}</span>
                        </div>
                    )}
                    {passwordError && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-800 flex items-center gap-3">
                            <span className="text-sm font-medium">{passwordError}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">New Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                value={passwordData.password}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-[#F4F7FA] dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#00684A] dark:focus:ring-emerald-500/50 text-gray-900 dark:text-white transition-all outline-none"
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                id="confirmPassword"
                                required
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-[#F4F7FA] dark:bg-slate-800 border-none rounded-xl focus:ring-2 focus:ring-[#00684A] dark:focus:ring-emerald-500/50 text-gray-900 dark:text-white transition-all outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-slate-800">
                        <button
                            type="submit"
                            disabled={isPasswordLoading || !passwordData.password || !passwordData.confirmPassword}
                            className="px-6 py-2.5 bg-gray-900 dark:bg-slate-700 text-white font-bold rounded-lg hover:bg-black dark:hover:bg-slate-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            <KeyRound size={18} />
                            {isPasswordLoading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

