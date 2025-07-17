import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/formatters";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";

import { ActiveToggleDropdownItem, DeleteDropdownItem } from "./_components/ProductAction";

import Link from "next/link";
import PageHeader from "../../_components/pageHeader";
import db from "@/config/db";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const PAGE_SIZE = 9;

export default async function AdminProductsPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = Number(searchParams?.page) || 1;
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4 gap-4">
        <PageHeader>Products</PageHeader>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>
      <ProductsTable page={page} />
    </div>
  );
}

async function ProductsTable({ page }: { page: number }) {
  const [products, total] = await Promise.all([
    db.product.findMany({
      select: {
        id: true,
        name: true,
        priceInCents: true,
        isAvailableForPurchase: true,
        _count: { select: { orders: true } },
      },
      orderBy: { name: "asc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.product.count(),
  ]);

  if (!products || products.length === 0)
    return <p className="text-gray-500">No products found.</p>;

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <>
      <div className="border rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-white">
              <TableHead className="w-8 text-center"></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-24">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product, index) => (
              <TableRow key={product.id} className="hover:bg-muted/50">
                <TableCell className="text-center text-sm text-muted-foreground">
                  {(page - 1) * PAGE_SIZE + index + 1}
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
                <TableCell className="text-sm text-gray-700">
                  { product.isAvailableForPurchase ? (
                    <>
                      <span className="sr-only">Available</span>
                      <CheckCircle2 className="text-green-600" />
                    </>
                  ) : (
                    <>
                      <span className="sr-only">Unavailable</span>
                      <XCircle className="text-red-600 stroke-destructive" />
                    </>
                  )}
                </TableCell>
                <TableCell className="text-sm text-right w-[100px]">
                  <div className="flex items-center">
                    <div className="px-1">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/admin/products/${product.id}`}>
                          Manage
                        </Link>
                      </Button>
                    </div>
                    <div className="px-1">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="group hover:bg-gray-100 focus:bg-gray-100 transition">
                            <MoreVertical className="w-4 h-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 p-3 flex flex-col">
                          <DropdownMenuItem asChild>
                            <a
                              download
                              href={`/admin/products/${product.id}/download`}
                              className="text-sm"
                            >
                              Download
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <a
                              href={`/admin/products/${product.id}/edit`}
                              className="text-sm"
                            >
                              Edit
                            </a>
                          </DropdownMenuItem>
                          <ActiveToggleDropdownItem id={ product.id } isAvailableForPurchase={ product.isAvailableForPurchase }/>
                          <DeleteDropdownItem id={ product.id } disabled={ product._count.orders > 0 }/>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Info & Controls */}
      <div className="flex flex-wrap justify-between items-center gap-2 mt-4">
        <div className="text-sm text-muted-foreground px-2">
          {`Showing ${(page - 1) * PAGE_SIZE + 1} to ${Math.min(page * PAGE_SIZE, total)} of ${total} results`}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={page <= 1}
          >
            <Link href={`/admin/products?page=${page - 1}`}>Previous</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            disabled={page >= totalPages}
          >
            <Link href={`/admin/products?page=${page + 1}`}>Next</Link>
          </Button>
        </div>
      </div>
    </>
  );
}
