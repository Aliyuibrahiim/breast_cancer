"use client";

import React from "react";
import { Eye, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Diagnostic {
    id: string;
    predictionResult: "benign" | "malignant";
    confidenceScore: string;
    createdAt: Date;
    notes?: string;
}

export default function PatientDiagnostics({ patientId, diagnostics }: { patientId: string, diagnostics: Diagnostic[] }) {
    
    // Parse the confidence score out of the string like "98%"
    const parseConfidence = (score: string) => {
        const num = parseInt(score.replace('%', ''), 10);
        return isNaN(num) ? 0 : num;
    };

    return (
        <div className="bg-white dark:bg-slate-800 shadow-sm rounded-xl overflow-hidden border border-gray-100 dark:border-slate-700">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Screening History</h3>
                <Link href="#" className="text-sm text-[#00684A] hover:text-[#00543B] font-semibold flex items-center gap-1 transition-colors">
                    View Full Archive <ExternalLink size={14} />
                </Link>
            </div>

            {diagnostics.length === 0 ? (
                <div className="px-6 py-12 text-center">
                    <div className="mx-auto w-12 h-12 bg-emerald-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-3 text-[#00684A]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">No screenings recorded yet.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-500 uppercase tracking-wider bg-gray-50/50 dark:bg-slate-800/50">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Modality</th>
                                <th className="px-6 py-4">Findings</th>
                                <th className="px-6 py-4">AI Concordance</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                            {diagnostics.map((diag) => {
                                const confidenceValue = parseConfidence(diag.confidenceScore);
                                
                                return (
                                <tr key={diag.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                    <td suppressHydrationWarning className="px-6 py-5 whitespace-nowrap">
                                        <div className="font-bold text-gray-900 dark:text-white">
                                            {new Date(diag.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">
                                            Ref: #{diag.id.substring(0, 8).toUpperCase()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 dark:text-slate-300">
                                            Screening Mammogram
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 inline-flex text-xs font-bold rounded ${diag.predictionResult === 'malignant' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-emerald-50 text-[#00684A] border border-emerald-100'
                                            }`}>
                                            {diag.predictionResult.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3 w-48">
                                            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-1.5">
                                                <div 
                                                    className="bg-[#00684A] h-1.5 rounded-full" 
                                                    style={{ width: `${confidenceValue}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">{diag.confidenceScore}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                        <button className="p-2 text-gray-400 hover:text-[#00684A] hover:bg-emerald-50 rounded-lg transition-colors">
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
