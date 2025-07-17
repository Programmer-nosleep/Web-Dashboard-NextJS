import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageHeader from "../../_components/pageHeader";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

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

function ProductsTable() {
  return (
    <div className="border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="w-8 text-center">
                <span className="sr-only">Available</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="text-right w-24">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index} className="hover:bg-muted/50">
                <TableCell className="text-center">🟢</TableCell>
                <TableCell className="font-medium text-sm text-gray-800">
                  Sample Product {index + 1}
                </TableCell>
                <TableCell className="text-sm text-gray-700">$0.00</TableCell>
                <TableCell className="text-sm text-gray-700">0</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    Manage
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  );
}