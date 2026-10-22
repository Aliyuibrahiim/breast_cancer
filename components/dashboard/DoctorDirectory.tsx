"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Plus, Filter, User } from "lucide-react";

export default function DoctorDirectory({ doctors }: { doctors: any[] }) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredDoctors = doctors.filter((doc) =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto py-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Medical Staff Directory</h1>
                </div>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="relative w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-[#00684A] text-gray-900 dark:text-white transition-all outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                        <Filter size={18} />
                        <span>Filters</span>
                    </button>
                    <Link 
                        href="/patients/new"
                        className="flex items-center gap-2 px-4 py-2.5 bg-[#00684A] text-white font-medium rounded-lg hover:bg-[#00543B] transition-colors shadow-sm"
                    >
                        <Plus size={18} />
                        <span>Add New Doctor</span>
                    </Link>
                </div>
            </div>

            {/* Doctors Grid */}
            {filteredDoctors.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredDoctors.map((doc) => (
                        <div key={doc.id} className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col items-center p-6 text-center">
                            
                            {/* Avatar */}
                            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/30 rounded-full flex items-center justify-center text-[#00684A] dark:text-emerald-400 mb-4 overflow-hidden border-2 border-emerald-100 dark:border-emerald-800">
                                <User size={32} />
                            </div>

                            {/* Name & Email */}
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 leading-tight">Dr. {doc.name}</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-slate-400 mb-6 truncate w-full">{doc.email}</p>

                            {/* View Profile Button */}
                            <Link href={`/doctors/${doc.id}`} className="w-full mt-auto">
                                <button className="w-full py-2.5 border border-gray-200 dark:border-slate-700 text-[#00684A] dark:text-emerald-400 font-semibold rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                                    View Profile
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-dashed border-gray-200 dark:border-slate-800">
                    <div className="mx-auto w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <Search className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No doctors found</h3>
                    <p className="text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
                        We couldn't find any medical staff matching your search query. Try adjusting your filters.
                    </p>
                </div>
            )}
            
            {/* Simple Pagination Mock */}
            {filteredDoctors.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-10 pt-6 border-t border-gray-100 dark:border-slate-800">
                    <span className="text-sm text-gray-500 dark:text-slate-400 mb-4 sm:mb-0">
                        Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredDoctors.length}</span> medical staff members
                    </span>
                    <div className="flex items-center gap-2">
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            &lt;
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#00684A] text-white font-semibold shadow-sm">
                            1
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors font-medium">
                            2
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                            &gt;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
