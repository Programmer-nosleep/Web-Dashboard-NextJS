import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageHeader from "../../_components/pageHeader";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { formatCurrency } from "@/lib/formatters";
import db from "@/config/db";

export default function AdminProductsPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable />
    </div>
  );
}

async function ProductsTable() {
  const products = await db.product.findMany({
    select: {
      id: true,
      name: true,
      priceInCents: true,
      isAvailableForPurchse: true,
      _count: { select: { orders: true } },
    },
    orderBy: { name: "asc" },
  });

  if (!products || products.length === 0)
    return <p className="text-gray-500">No products found.</p>;

  return (
    <div className="border rounded-xl overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-white">
            <TableHead className="w-8 text-center"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead className="text-right w-24">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={product.id} className="hover:bg-muted/50">
              <TableCell className="text-center text-sm text-muted-foreground">
                {index + 1}
              </TableCell>
              <TableCell className="font-medium text-sm text-gray-800">
                {product.name}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {formatCurrency(product.priceInCents / 100)}
              </TableCell>
              <TableCell className="text-sm text-gray-700">
                {product._count.orders}
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/admin/products/${product.id}`}>
                    Manage
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
