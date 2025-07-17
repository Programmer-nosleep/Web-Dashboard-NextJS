"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from "recharts";

export interface DashboardCurveChartProps {
  data: Array<{ name: string; sales: number; orders: number; customers: number }>;
}

import { useState } from "react";

export default function DashboardCurveChart({ data }: DashboardCurveChartProps) {
  const [period, setPeriod] = useState<'month'|'year'>('month');
  const [showTrends, setShowTrends] = useState(true);
  // Hanya tampilkan sales, mirip referensi
  return (
    <div className="w-full bg-white rounded-xl shadow p-0 mt-8">
      <div className="flex justify-between items-center px-6 pt-6 pb-2">
        <div className="font-semibold text-lg">Analysis</div>
        <div className="flex items-center gap-2">
          <button onClick={()=>setPeriod('month')} className={`px-3 py-1 rounded-md text-sm font-medium border ${period==='month'?'bg-indigo-600 text-white border-indigo-600':'bg-white text-gray-700 border-gray-300'}`}>Month</button>
          <button onClick={()=>setPeriod('year')} className={`px-3 py-1 rounded-md text-sm font-medium border ${period==='year'?'bg-indigo-600 text-white border-indigo-600':'bg-white text-gray-700 border-gray-300'}`}>Year</button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Data trends</span>
          <span className={`inline-block w-2 h-2 rounded-full ${showTrends?'bg-green-500':'bg-gray-300'}`}></span>
          <input type="checkbox" checked={showTrends} onChange={()=>setShowTrends(v=>!v)} className="ml-1" style={{accentColor:'#6366f1'}} />
        </div>
      </div>
      <div className="px-2 pb-4">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="8 8" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 13, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 13, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{borderRadius:8, fontSize:13}} />
            {/* Hanya tampilkan area sales, dot di setiap titik, smooth curve */}
            {showTrends && (
              <Area type="monotone" dataKey="sales" stroke="#6366f1" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} dot={{r:5, stroke:'#fff', strokeWidth:2}} activeDot={{r:7}} name="Sales" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
