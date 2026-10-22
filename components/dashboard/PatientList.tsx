"use client";

import React, { useState } from "react";
import Link from "next/link";
import { deletePatient } from "@/services/patient";
import { Search, Filter, RefreshCw, ChartBar, History, MoreVertical, Users, AlertTriangle, Hourglass, Clock } from "lucide-react";

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date | string | null;
    gender: "female" | "male" | "other";
    contactNumber: string | null;
    email: string | null;
    createdAt: Date;
    diagnostics?: any[];
}

export default function PatientList({ patients, userRole = "doctor" }: { patients: Patient[], userRole?: string }) {
    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("active"); // Mock filter for UI

    const toggleDropdown = (id: string) => {
        setOpenDropdownId(openDropdownId === id ? null : id);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this patient?")) return;
        
        setIsDeleting(id);
        try {
            await deletePatient(id);
            setOpenDropdownId(null);
        } catch (error) {
            alert("Failed to delete patient");
        } finally {
            setIsDeleting(null);
        }
    };

    // Filter logic
    const filteredPatients = patients.filter((patient) => {
        const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
        const matchesSearch = 
            fullName.includes(searchQuery.toLowerCase()) || 
            (patient.id || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
            (patient.email?.toLowerCase() || "").includes(searchQuery.toLowerCase());
        
        return matchesSearch;
    });

    const calculateAge = (dob: Date | string | null | undefined) => {
        if (!dob) return "--";
        const diff = Date.now() - new Date(dob).getTime();
        const age = new Date(diff); 
        return Math.abs(age.getUTCFullYear() - 1970) + "Y";
    };

    const getPatientInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    };

    // Stats calculations
    const totalPatients = patients.length;
    const highRiskCount = patients.filter(p => p.diagnostics?.[0]?.predictionResult === 'malignant').length;

    // Derived mock BIRADS from diagnostic or randomness for UI
    const getMockBirads = (patient: Patient) => {
        const diag = patient.diagnostics?.[0];
        if (!diag) return "--";
        if (diag.predictionResult === 'malignant') return "5";
        return "2";
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    };

    return (
        <div className="space-y-6">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Registered</span>
                        <Users className="w-5 h-5 text-[#00684A]" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{totalPatients.toLocaleString()}</div>
                    <div className="text-xs font-medium text-[#00684A] flex items-center gap-1 mt-auto">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        +12 this month
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">High Risk</span>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <div className="text-3xl font-bold text-red-500 mb-1">{highRiskCount}</div>
                    <div className="text-xs font-medium text-red-500 mt-auto">Requires urgent review</div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending Screenings</span>
                        <Hourglass className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">18</div>
                    <div className="text-xs font-medium text-gray-500 mt-auto">AI processing in progress</div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Last 24h Intake</span>
                        <Clock className="w-5 h-5 text-[#00684A]" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">09</div>
                    <div className="text-xs font-medium text-[#00684A] mt-auto">Above daily average</div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-slate-800 rounded-t-xl border border-gray-100 dark:border-slate-700 p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:w-[400px]">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Filter by Name or Patient ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-slate-900 border-none rounded-lg text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-gray-300 transition-shadow"
                    />
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500 font-medium">Status:</span>
                        <select 
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-gray-50 dark:bg-slate-900 border-none text-gray-700 dark:text-gray-200 text-sm rounded-lg py-2 pl-3 pr-8 focus:ring-1 focus:ring-gray-300"
                        >
                            <option value="active">Active Patients</option>
                            <option value="inactive">Inactive</option>
                            <option value="all">All Statuses</option>
                        </select>
                    </div>
                    
                    <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-[#00684A] bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                        <Filter size={16} />
                        More Filters
                    </button>
                    
                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <RefreshCw size={18} />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-b-xl border border-t-0 border-gray-100 dark:border-slate-700 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead>
                        <tr className="border-b border-gray-100 dark:border-slate-700 bg-gray-50/50 dark:bg-slate-800/50">
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[30%]">Patient & ID</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Demographics</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Last Screening</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">BI-RADS</th>
                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {filteredPatients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    No patients found matching your search.
                                </td>
                            </tr>
                        ) : (
                            filteredPatients.map((patient) => {
                                const latestDiag = patient.diagnostics?.[0];
                                const birads = getMockBirads(patient);
                                
                                return (
                                <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-full bg-emerald-50 flex items-center justify-center text-sm font-bold text-[#00684A] shrink-0">
                                                {getPatientInitials(patient.firstName, patient.lastName)}
                                            </div>
                                            <div>
                                                <Link href={`/patients/${patient.id}`} className="font-semibold text-gray-900 dark:text-white hover:text-[#00684A] transition-colors">
                                                    {patient.firstName} {patient.lastName}
                                                </Link>
                                                <div className="text-xs text-gray-400 font-medium">#{patient.id.substring(0, 8).toUpperCase()}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                            {calculateAge(patient.dateOfBirth)}, {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {latestDiag ? formatDate(latestDiag.createdAt) : "Pending"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {birads !== "--" ? (
                                            <span className="inline-flex items-center justify-center px-2.5 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded border border-blue-100">
                                                {birads}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-sm">--</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 relative">
                                            <Link href={`/patients/${patient.id}`} className="p-2 text-gray-400 hover:text-[#00684A] hover:bg-emerald-50 rounded-lg transition-colors">
                                                <ChartBar size={18} />
                                            </Link>
                                            <button className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                                                <History size={18} />
                                            </button>
                                            <button 
                                                onClick={() => toggleDropdown(patient.id)}
                                                className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <MoreVertical size={18} />
                                            </button>
                                            
                                            {openDropdownId === patient.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setOpenDropdownId(null)}></div>
                                                    <div className="absolute right-8 top-10 w-36 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-100 dark:border-slate-700 z-20 py-1 text-left">
                                                        <Link 
                                                            href={`/patients/${patient.id}/edit`}
                                                            className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                                        >
                                                            Edit Profile
                                                        </Link>
                                                        {userRole === "admin" && (
                                                            <button 
                                                                onClick={() => handleDelete(patient.id)}
                                                                disabled={isDeleting === patient.id}
                                                                className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            >
                                                                {isDeleting === patient.id ? "Deleting..." : "Delete"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )})
                        )}
                    </tbody>
                </table>
                
                {/* Pagination (Mocked UI) */}
                <div className="border-t border-gray-100 dark:border-slate-700 px-6 py-4 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        Showing <span className="font-semibold text-gray-900 dark:text-white">1 - {Math.min(filteredPatients.length, 10)}</span> of <span className="font-semibold text-gray-900 dark:text-white">{filteredPatients.length}</span> patients
                    </div>
                    
                    <div className="flex items-center gap-1">
                        <button className="p-1 text-gray-400 hover:text-gray-900 transition-colors" disabled>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#00684A] text-white text-sm font-semibold">1</button>
                        {filteredPatients.length > 10 && (
                            <>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors">2</button>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors">3</button>
                                <span className="px-1 text-gray-400">...</span>
                                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors">
                                    {Math.ceil(filteredPatients.length / 10)}
                                </button>
                            </>
                        )}
                        <button className="p-1 text-gray-400 hover:text-gray-900 transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
