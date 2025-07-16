import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatCurrency } from "@/lib/formatters";
import db from "@/config/db";

export default async function AdminDashboard() {
  const salesData = await getSalesData();

  return (
    <div className="px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard title="Sales" subtitle={formatNumber(salesData.numberOfSales)} body={formatCurrency(salesData.amount)} /> 
    </div>
  );
}

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}

export function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}

async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum?.pricePaidInCents ?? 808080.99) / 100,
    numberOfSales: data._count
  };
}
