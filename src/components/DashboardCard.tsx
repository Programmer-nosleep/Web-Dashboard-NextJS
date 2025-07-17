"use client";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { MoreHorizontal } from "lucide-react";

export type DashboardCardProps = {
  title: string;
  subtitle: string;
  body: string;
  color: string; 
  trend: {
    value: number; 
    text: string; 
  };
  chartData: { value: number }[];
  chartColor: string;
};

export default function DashboardCard({ title, subtitle, body, color, trend, chartData, chartColor }: DashboardCardProps) {
  const isUp = trend.value > 0;
  return (
    <div className={`relative rounded-xl p-4 ${color} shadow-sm min-h-[150px] flex flex-col justify-between overflow-hidden mt-4`}>  
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs font-medium text-gray-600 mb-1">{title}</div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{body}</div>
          <div className="flex items-center gap-1 text-xs">
            <span className={isUp ? 'text-green-600' : 'text-red-600'}>
              {isUp ? <span>&#8593;</span> : <span>&#8595;</span>}
              {Math.abs(trend.value * 100)}%
            </span>
            <span className="text-gray-500">{trend.text}</span>
          </div>
        </div>
        <button className="p-1 rounded-full hover:bg-gray-200 text-gray-400"><MoreHorizontal size={18} /></button>
      </div>
      <div className="absolute bottom-2 right-2 w-24 h-10 pointer-events-none opacity-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="miniColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.25}/>
                <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={chartColor} fillOpacity={1} fill="url(#miniColor)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
