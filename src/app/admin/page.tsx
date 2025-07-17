import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatNumber, formatCurrency } from "@/lib/formatters";
import db from "@/config/db";

import PageHeader from "../_components/pageHeader";
import DashboardCard from "@/components/DashboardCard";
import DashboardCurveChart from "@/components/DashboardCurveChart";

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all(
    [
      getSalesData(),
      getUserData(),
      getProductData()
    ]
  );
   
  // Data untuk chart: 7 bulan terakhir, sales, customers, active products
  const chartData = [
    { name: "Jan", sales: 0, customers: 0, products: 0 },
    { name: "Feb", sales: 0, customers: 0, products: 0 },
    { name: "Mar", sales: 0, customers: 0, products: 0 },
    { name: "Apr", sales: 0, customers: 0, products: 0 },
    { name: "May", sales: 0, customers: 0, products: 0 },
    { name: "Jun", sales: 0, customers: 0, products: 0 },
    { name: "Jul", sales: salesData.amount, customers: userData.userCount, products: productData.activeCount },
  ];
  return (
    <div className="p-6">
      <PageHeader>Dashboard</PageHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Sales"
          subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
          body={`${formatCurrency(salesData.amount)}`}
          color="bg-green-50"
          trend={{ value: -0.1, text: 'vs last month' }}
          chartData={[{value: 20},{value:18},{value:15},{value:17},{value:14},{value:13},{value:15}]}
          chartColor="#ef4444"
        />
        <DashboardCard
          title="Customers"
          subtitle={`${formatNumber(userData.averageValuePerUser)} Average Value`}
          body={`${formatNumber(userData.userCount)} Users`}
          color="bg-orange-50"
          trend={{ value: 0.4, text: 'vs last month' }}
          chartData={[{value:10},{value:12},{value:14},{value:13},{value:15},{value:18},{value:20}]}
          chartColor="#10b981"
        />
        <DashboardCard
          title="Active Products"
          subtitle={`${formatNumber(productData.inactiveCount)} Inactive`}
          body={`${formatNumber(productData.activeCount)} Active`}
          color="bg-indigo-50"
          trend={{ value: 0.2, text: 'vs last month' }}
          chartData={[{value:8},{value:9},{value:10},{value:12},{value:13},{value:14},{value:16}]}
          chartColor="#06b6d4"
        />
      </div>
      <div className="mt-8">
        <DashboardCurveChart data={chartData} />
      </div>
    </div>
  );
}



async function getSalesData() {
  const data = await db.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  });

  return {
    amount: (data._sum?.pricePaidInCents ?? 0) / 100,
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
    db.product.count({ where: { isAvailableForPurchase: true } }),
    db.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return {
    activeCount, inactiveCount
  };
}