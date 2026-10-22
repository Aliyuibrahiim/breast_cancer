import React from "react";
import Link from "next/link";

interface Patient {
    id: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    gender: string;
}

export default function RecentPatients({ patients }: { patients: Patient[] }) {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recently Added Patients</h3>
                <Link href="/patients" className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors">
                    View All
                </Link>
            </div>
            
            <div className="flex-1 overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-gray-50 dark:bg-slate-800/50 text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700">
                            <th className="px-6 py-3">Patient Name</th>
                            <th className="px-6 py-3">Gender</th>
                            <th className="px-6 py-3 text-right">Date Added</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                        {patients.length === 0 ? (
                            <tr>
                                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                    No patients found.
                                </td>
                            </tr>
                        ) : (
                            patients.map((patient) => (
                                <tr key={patient.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {patient.firstName} {patient.lastName}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                                            patient.gender === 'female' ? 'bg-pink-100 text-pink-800' : 
                                            patient.gender === 'male' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                                        </span>
                                    </td>
                                    <td suppressHydrationWarning className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-500 dark:text-slate-400">
                                        {new Date(patient.createdAt).toISOString().split('T')[0]}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
