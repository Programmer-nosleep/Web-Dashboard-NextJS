import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatCurrency } from "@/lib/formatters";
import db from "@/config/db";

import PageHeader from "../_components/pageHeader";

type DashboardCardProps = {
  title: string
  subtitle: string
  body: string
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all(
    [
      getSalesData(),
      getUserData(),
      getProductData()
    ]
  );
   
  return (
    <div className="p-6">
      <PageHeader className="mb-4">Dashboard</PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard title="Sales" subtitle={`${formatNumber(salesData.numberOfSales)} Orders`} body={`${formatCurrency(salesData.amount)}`} /> 
        <DashboardCard title="Customers" subtitle={`${formatNumber(userData.averageValuePerUser)} Average Value`} body={`${formatNumber(userData.userCount)} Users`} />
        <DashboardCard title="Active Products" subtitle={`${formatNumber(productData.inactiveCount)} Inactive`} body={`${formatNumber(productData.activeCount)} Active`} />
      </div>
    </div>
  );
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

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    db.user.count(),
    db.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser: userCount === 0 ? 0 : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  }
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    db.product.count({ where: { isAvailableForPurchse: true } }),
    db.product.count({ where: { isAvailableForPurchse: false } }),
  ]);

  return {
    activeCount, inactiveCount
  };
}