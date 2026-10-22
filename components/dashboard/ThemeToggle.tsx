"use client";

import React from "react";
import { useTheme } from "@/components/ThemeProvider";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-[34px] bg-blue-950/30 rounded-lg border border-blue-800/50" />;
    }

    return (
        <div className="flex items-center space-x-2 bg-blue-950/30 p-1 rounded-lg border border-blue-800/50">
            <button
                onClick={() => setTheme("light")}
                className={`p-1.5 rounded-md transition-all ${theme === 'light' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-300 hover:text-white'}`}
                title="Light Mode"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            </button>
            <button
                onClick={() => setTheme("system")}
                className={`p-1.5 rounded-md transition-all ${theme === 'system' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-300 hover:text-white'}`}
                title="System Preference"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-1.5 rounded-md transition-all ${theme === 'dark' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-300 hover:text-white'}`}
                title="Dark Mode"
            >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
            </button>
        </div>
    );
}
