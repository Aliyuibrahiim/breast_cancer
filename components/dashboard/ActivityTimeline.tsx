import React from "react";
import { Activity, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface TimelineItem {
    id: string;
    patientId: string;
    patientName: string;
    predictionResult: string;
    confidenceScore: string;
    createdAt: Date;
    doctorName?: string;
}

export default function ActivityTimeline({ items }: { items: TimelineItem[] }) {
    if (!items || items.length === 0) {
        return (
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex items-center justify-center min-h-[300px]">
                <p className="text-gray-500">No recent activity found.</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Recent Activity Timeline</h3>
            
            <div className="relative border-l border-gray-200 dark:border-slate-700 ml-3 space-y-8">
                {items.map((item, index) => {
                    const isMalignant = item.predictionResult === "malignant";
                    
                    return (
                        <div key={item.id} className="relative pl-6">
                            {/* Timeline marker */}
                            <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-800 ${isMalignant ? 'bg-red-500' : 'bg-emerald-500'}`} />
                            
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                                        Screening completed for <Link href={`/patients/${item.patientId}`} className="text-[#00684A] dark:text-emerald-400 hover:underline">{item.patientName}</Link>
                                    </h4>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">
                                        Result: <span className={`font-semibold capitalize ${isMalignant ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>{item.predictionResult}</span> ({item.confidenceScore} confidence)
                                    </p>
                                    {item.doctorName && (
                                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">
                                            Run by Dr. {item.doctorName}
                                        </p>
                                    )}
                                </div>
                                
                                <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
                                    {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className="mt-6 text-center">
                <Link href="/patients" className="text-sm font-semibold text-[#00684A] dark:text-emerald-400 hover:underline">
                    View all patient records
                </Link>
            </div>
        </div>
    );
}
