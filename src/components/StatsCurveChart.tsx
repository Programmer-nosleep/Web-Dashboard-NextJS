"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export interface StatsCurveChartProps {
  data: Array<{ name: string; sales: number; orders: number; customers: number }>;
}

export default function StatsCurveChart({ data }: StatsCurveChartProps) {
  return (
    <div className="w-full bg-white rounded-xl shadow p-6 mt-8">
      <h3 className="font-semibold text-lg mb-4">Overview</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={3} dot={false} name="Sales" />
          <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={3} dot={false} name="Orders" />
          <Line type="monotone" dataKey="customers" stroke="#f59e42" strokeWidth={3} dot={false} name="Customers" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
