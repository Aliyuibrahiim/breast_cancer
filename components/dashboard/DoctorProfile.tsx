"use client";

import React from "react";
import Link from "next/link";
import { User, ChevronRight, Edit } from "lucide-react";

export default function DoctorProfile({ doctor, assignedPatients }: { doctor: any, assignedPatients: any[] }) {
    return (
        <div className="max-w-7xl mx-auto py-8">
            {/* Header / Breadcrumbs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center text-sm font-semibold text-gray-500">
                    <Link href="/doctors" className="hover:text-gray-900 dark:hover:text-white transition-colors">
                        Doctors
                    </Link>
                    <ChevronRight size={14} className="mx-2" />
                    <span className="text-gray-900 dark:text-white font-bold">Dr. {doctor.name}</span>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-[#00684A] dark:text-emerald-400 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                    <Edit size={16} />
                    <span>Edit Profile</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Profile Card */}
                <div className="col-span-1">
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm p-8 text-center flex flex-col items-center">
                        {/* Avatar */}
                        <div className="w-32 h-32 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center text-[#00684A] dark:text-emerald-400 mb-6 border border-emerald-100 dark:border-emerald-800/50 overflow-hidden">
                            <User size={48} />
                        </div>
                        
                        {/* Name */}
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Dr. {doctor.name}</h2>
                        
                        {/* Status/Role Tag */}
                        <div className="flex items-center gap-2 mt-2">
                            <span className="px-3 py-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 text-xs font-bold rounded-full">
                                {doctor.email}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Assigned Patients */}
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Assigned Patients</h3>
                            <span className="text-sm font-semibold text-[#00684A] dark:text-emerald-400 cursor-pointer hover:underline">View All</span>
                        </div>
                        
                        <div className="overflow-x-auto flex-grow">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 dark:bg-slate-800/50 text-xs uppercase text-gray-500 dark:text-slate-400 font-bold tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Patient Name</th>
                                        <th className="px-6 py-4">ID</th>
                                        <th className="px-6 py-4">Last Screening</th>
                                        <th className="px-6 py-4">Risk Level</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                                    {assignedPatients.length > 0 ? (
                                        assignedPatients.map((patient) => (
                                            <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-[#00684A] dark:text-emerald-400 font-bold text-xs">
                                                            {patient.firstName[0]}{patient.lastName[0]}
                                                        </div>
                                                        <div className="font-semibold text-gray-900 dark:text-white">
                                                            {patient.firstName} {patient.lastName}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-slate-400 font-medium">
                                                    #PX-{patient.id.substring(0, 4)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-gray-500 dark:text-slate-400">
                                                    {new Date(patient.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {/* Mocking risk level since it's not in schema */}
                                                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-400">
                                                        TBD
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <Link href={`/patients/${patient.id}`} className="text-gray-400 hover:text-[#00684A] dark:hover:text-emerald-400 transition-colors inline-flex">
                                                        <ChevronRight size={20} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-slate-400">
                                                No patients are currently assigned to this doctor.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
