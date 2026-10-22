"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Edit, FileText, Play } from "lucide-react";

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date | string | null;
    gender: string;
}

export default function PatientProfileHeader({ 
    patient, 
    lastScreeningDate,
    assignedDoctorName,
    currentUserRole
}: { 
    patient: Patient; 
    lastScreeningDate?: string;
    assignedDoctorName?: string;
    currentUserRole?: string;
}) {
    const calculateAge = (dob: Date | string | null | undefined) => {
        if (!dob) return "--";
        const diff = Date.now() - new Date(dob).getTime();
        const age = new Date(diff); 
        return Math.abs(age.getUTCFullYear() - 1970);
    };

    const getPatientInitials = (first: string, last: string) => {
        return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
    };

    const age = calculateAge(patient.dateOfBirth);
    const shortId = patient.id.substring(0, 8).toUpperCase();

    return (
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl border border-gray-100 dark:border-slate-700 p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-20 h-20 bg-[#00684A] text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-sm">
                            {getPatientInitials(patient.firstName, patient.lastName)}
                        </div>
                        <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-800">
                            ACTIVE
                        </div>
                    </div>
                    
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {patient.firstName} {patient.lastName}
                        </h1>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-gray-500 dark:text-slate-400 font-medium">
                            <span className="flex items-center gap-1">
                                <span className="text-gray-400">#</span>
                                {shortId}-C
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                            <span className="flex items-center gap-1">
                                <span className="text-gray-400">📅</span>
                                DOB: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "Unknown"} ({age}y)
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-slate-600"></span>
                            <span className="flex items-center gap-1 capitalize">
                                <span className="text-gray-400">⚧</span>
                                {patient.gender}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link 
                        href={`/patients/${patient.id}/edit`}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 shadow-sm"
                    >
                        <Edit size={16} className="text-[#00684A]" />
                        Edit Info
                    </Link>
                    <button 
                        className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors bg-white dark:bg-slate-800 shadow-sm"
                    >
                        <FileText size={16} className="text-[#00684A]" />
                        Medical Record
                    </button>
                    {currentUserRole === "doctor" && (
                        <Link 
                            href={`/diagnostics?patientId=${patient.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-[#00684A] text-white rounded-lg text-sm font-medium hover:bg-[#00543B] transition-colors shadow-sm"
                        >
                            <Play size={16} />
                            Run New Screening
                        </Link>
                    )}
                </div>
            </div>

            {/* Status Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-slate-700">
                <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-100 dark:border-slate-700">
                    <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">LAST SCREENING</div>
                    <div className="text-xl font-bold text-gray-900 dark:text-white">
                        {lastScreeningDate ? new Date(lastScreeningDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : "None"}
                    </div>
                </div>
                
                <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-lg p-4 border border-blue-100 dark:border-blue-900/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-300 font-bold shrink-0">
                        {assignedDoctorName ? getPatientInitials(assignedDoctorName.split(' ')[0] || '', assignedDoctorName.split(' ')[1] || '') : "MD"}
                    </div>
                    <div>
                        <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-0.5">ASSIGNED MD</div>
                        <div className="text-sm font-bold text-gray-900 dark:text-white">
                            {assignedDoctorName ? `Dr. ${assignedDoctorName}` : "Unassigned"}
                        </div>
                        <div className="text-[10px] text-gray-500">Oncologist</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
