"use client";

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface ChartData {
  name: string;
  Malignant: number;
  Benign: number;
  total: number;
}

interface AnalyticsChartProps {
  data: ChartData[];
}

export default function AnalyticsChart({ data }: AnalyticsChartProps) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Diagnostic Trends</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Monthly breakdown of AI screening predictions.</p>
      </div>
      
      {data.length === 0 ? (
        <div className="flex h-64 items-center justify-center text-gray-400 dark:text-gray-500">
          No diagnostic data available yet.
        </div>
      ) : (
        <div className="w-full" style={{ minHeight: '300px' }}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-gray-200 dark:text-slate-700" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: 'currentColor' }}
                axisLine={{ stroke: 'currentColor', className: 'text-gray-300 dark:text-slate-600' }}
                tickLine={false}
                className="text-gray-500 dark:text-slate-400 text-xs"
              />
              <YAxis 
                tick={{ fill: 'currentColor' }}
                axisLine={false}
                tickLine={false}
                className="text-gray-500 dark:text-slate-400 text-xs"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--tw-colors-white, #fff)', 
                  border: '1px solid var(--tw-colors-gray-200, #e5e7eb)',
                  borderRadius: '0.5rem',
                  color: '#111827'
                }}
                itemStyle={{ fontSize: '0.875rem' }}
                cursor={{ fill: 'currentColor', className: 'text-gray-50 dark:text-slate-700/50' }}
                wrapperClassName="dark:!bg-slate-800 dark:!border-slate-700 dark:!text-white"
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Bar dataKey="Benign" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Malignant" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
