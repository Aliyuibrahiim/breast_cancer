import React from "react";
import StatCard from "@/components/dashboard/StatCard";
import RecentPatients from "@/components/dashboard/RecentPatients";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import AdminAnalyticsDashboard from "@/components/dashboard/AdminAnalyticsDashboard";
import { getDashboardStats, getRecentPatients, getDiagnosticTrends, getAdminAnalyticsData } from "@/services/dashboard";
import { getCurrentUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
    const user = await getCurrentUser();
    
    if (user?.role === "admin") {
        const adminData = await getAdminAnalyticsData();
        return <AdminAnalyticsDashboard data={adminData} />;
    }

    const stats = await getDashboardStats();
    const recentPatients = await getRecentPatients(5);
    const trendData = await getDiagnosticTrends();

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Here is a summary of the clinical data today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Registered Patients" 
                    value={stats.totalPatients} 
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    }
                    colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                />
                
                <StatCard 
                    title="Total Screenings Run" 
                    value={stats.totalScreenings} 
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                    }
                    colorClass="bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
                />

                <StatCard 
                    title="High-Risk Predictions" 
                    value={stats.highRiskCases} 
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    }
                    colorClass="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400"
                />

                <StatCard 
                    title="Pending Doctor Review" 
                    value={stats.pendingReview} 
                    icon={
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                    colorClass="bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-6 min-h-[300px]">
                    <AnalyticsChart data={trendData} />
                </div>

                <div className="lg:col-span-1">
                    <RecentPatients patients={recentPatients} />
                </div>
            </div>
        </div>
    );
}
