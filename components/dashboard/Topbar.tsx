"use client";

import React from "react";
import { Search, Settings, UserCircle } from "lucide-react";

export default function Topbar() {
    return (
        <header className="h-[72px] px-8 flex items-center justify-end border-b border-gray-100 dark:border-white/5 bg-transparent transition-colors duration-300">
            <div className="flex items-center gap-6">
                <div className="relative group hidden sm:block w-[320px]">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-[#00684A] dark:group-focus-within:text-teal-400 transition-colors">
                        <Search size={16} />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-full border border-gray-200 dark:border-white/10 bg-[#F4F7F6] dark:bg-white/5 py-2.5 pl-11 pr-4 text-sm text-gray-900 dark:text-white placeholder:text-gray-500 focus:ring-2 focus:ring-[#00684A]/20 dark:focus:ring-teal-500/20 focus:border-[#00684A] dark:focus:border-teal-500/50 outline-none transition-all duration-300"
                        placeholder="Search patients or medical records..."
                    />
                </div>
                
                <button className="text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors">
                    <Settings size={20} />
                </button>
                
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-white/10 flex items-center justify-center overflow-hidden border border-gray-200 dark:border-white/20">
                    <img src="https://ui-avatars.com/api/?name=Dr+Chen&background=00684A&color=fff" alt="User" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>
    );
}
