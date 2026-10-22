"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CaseDistributionProps {
    benignCount: number;
    malignantCount: number;
}

export default function CaseDistributionChart({ benignCount, malignantCount }: CaseDistributionProps) {
    const data = [
        { name: "Benign", value: benignCount, color: "#10B981" }, // Emerald 500
        { name: "Malignant", value: malignantCount, color: "#EF4444" }, // Red 500
    ];

    const total = benignCount + malignantCount;

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 flex flex-col h-full">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Case Distribution</h3>
            
            {total === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <p>No screening data available yet.</p>
                </div>
            ) : (
                <div className="flex-1 min-h-[250px] relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={90}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip 
                                formatter={(value: number) => [`${value} cases (${((value / total) * 100).toFixed(1)}%)`, 'Count']}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                        </PieChart>
                    </ResponsiveContainer>
                    
                    {/* Center Text overlay for donut */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                        <span className="text-3xl font-black text-gray-900 dark:text-white">{total}</span>
                        <span className="text-xs font-semibold text-gray-500">Total Cases</span>
                    </div>
                </div>
            )}
        </div>
    );
}
