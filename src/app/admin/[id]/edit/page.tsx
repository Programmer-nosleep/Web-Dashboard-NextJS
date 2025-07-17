import PageHeader from "@/app/_components/pageHeader";
import ProductForm from "../../products/_components/ProductForm";
import db from "@/config/db";

export default async function EditProductPage({ params: id }: { params: { id: string } }) {
  const product = await db.product.findUnique({ where: { id } })
  return (
    <div className="p-6">
      <PageHeader>Edit Product</PageHeader> 
      <div>
        <ProductForm product={product}/>
      </div>
    </div>
  );
}