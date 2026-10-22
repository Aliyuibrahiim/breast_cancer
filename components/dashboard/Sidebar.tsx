"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Stethoscope, Activity, BarChart, LogOut, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Need this to safely check dark mode class without hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (path: string) => {
        const isMatch = pathname === path || (path !== '/dashboard' && pathname?.startsWith(path));

        if (isMatch) {
            return "bg-[#00684A] dark:bg-teal-400 text-white dark:text-neutral-900 shadow-sm";
        }
        return "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5";
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
    };

    if (!mounted) return null; // Avoid hydration mismatch on initial render

    return (
        <div className="w-64 bg-white dark:bg-[#0B1120] border-r border-gray-100 dark:border-white/5 min-h-screen flex flex-col transition-colors duration-300 relative z-20">
            <div className="h-20 px-6 flex items-center border-b border-gray-100 dark:border-white/5">
                <h1 className="text-[22px] font-bold text-[#00684A] dark:text-teal-400 tracking-tight">
                    <span className="dark:hidden">OncoVision AI</span>
                    <span className="hidden dark:inline">OncoInsight AI</span>
                </h1>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                <Link
                    href="/dashboard"
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive('/dashboard')}`}
                >
                    <LayoutDashboard size={20} className={isActive('/dashboard').includes('bg-') ? 'text-white dark:text-neutral-900' : 'text-gray-400 dark:text-gray-500'} />
                    Dashboard
                </Link>
                <Link
                    href="/patients"
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive('/patients')}`}
                >
                    <Users size={20} className={isActive('/patients').includes('bg-') ? 'text-white dark:text-neutral-900' : 'text-gray-400 dark:text-gray-500'} />
                    Patients
                </Link>
                <Link
                    href="/doctors"
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive('/doctors')}`}
                >
                    <Stethoscope size={20} className={isActive('/doctors').includes('bg-') ? 'text-white dark:text-neutral-900' : 'text-gray-400 dark:text-gray-500'} />
                    Doctors
                </Link>
                <Link
                    href="/diagnostics"
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive('/diagnostics')}`}
                >
                    <Activity size={20} className={isActive('/diagnostics').includes('bg-') ? 'text-white dark:text-neutral-900' : 'text-gray-400 dark:text-gray-500'} />
                    New Screening
                </Link>
                {/* <Link 
                    href="/analytics" 
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive('/analytics')}`}
                >
                    <BarChart size={20} className={isActive('/analytics').includes('bg-') ? 'text-white dark:text-neutral-900' : 'text-gray-400 dark:text-gray-500'} />
                    Analytics
                </Link> */}
                <Link
                    href="/settings"
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-semibold text-sm ${isActive('/settings')}`}
                >
                    <Settings size={20} className={isActive('/settings').includes('bg-') ? 'text-white dark:text-neutral-900' : 'text-gray-400 dark:text-gray-500'} />
                    Settings
                </Link>
            </nav>

            <div className="p-4 flex justify-between items-center border-t border-gray-100 dark:border-white/5">
                <ThemeToggle />

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-white dark:hover:bg-white/5 transition-all duration-200"
                    title="Log out"
                >
                    <LogOut size={20} />
                    <span className="ml-2 text-sm font-semibold hidden dark:inline text-gray-400">Logout</span>
                </button>
            </div>
            {/* The mockups have some extra elements (city oncology info or similar) at the bottom, I will skip it to keep it simple, or I can add it if needed. The dark mode mockup shows City Oncology at top left though. Let's just keep standard logo. */}
        </div>
    );
}
