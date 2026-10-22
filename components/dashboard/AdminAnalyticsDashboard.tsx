import React from "react";
import StatCard from "./StatCard";
import CaseDistributionChart from "./CaseDistributionChart";
import ActivityTimeline from "./ActivityTimeline";
import { Activity, Percent, Users, FileText } from "lucide-react";

interface AdminAnalyticsProps {
    data: {
        totalCases: number;
        malignantCount: number;
        benignCount: number;
        recentActivity: any[];
        accuracyRating: string;
        peerReviews: string;
    };
}

export default function AdminAnalyticsDashboard({ data }: AdminAnalyticsProps) {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Hospital-wide clinical diagnostics overview.</p>
            </div>

            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Cases" 
                    value={data.totalCases} 
                    icon={<FileText className="w-6 h-6" />}
                    colorClass="bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                />
                
                <StatCard 
                    title="Accuracy Rating" 
                    value={data.accuracyRating} 
                    icon={<Percent className="w-6 h-6" />}
                    colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400"
                />

                <StatCard 
                    title="Peer Reviews" 
                    value={data.peerReviews} 
                    icon={<Users className="w-6 h-6" />}
                    colorClass="bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Case Distribution Donut Chart */}
                <div className="lg:col-span-1">
                    <CaseDistributionChart 
                        benignCount={data.benignCount} 
                        malignantCount={data.malignantCount} 
                    />
                </div>

                {/* Recent Activity Timeline */}
                <div className="lg:col-span-2">
                    <ActivityTimeline items={data.recentActivity} />
                </div>
            </div>
        </div>
    );
}
