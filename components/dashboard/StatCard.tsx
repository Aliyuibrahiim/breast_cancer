import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    colorClass?: string;
}

export default function StatCard({ title, value, icon, trend, colorClass = "bg-blue-50 text-blue-600" }: StatCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start space-x-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <div className="flex items-baseline mt-1 space-x-2">
                    <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                    {trend && (
                        <span className={`text-sm font-medium ${trend.isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
                            {trend.isPositive ? '↑' : '↓'} {trend.value}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
