import PageHeader from "../../../_components/pageHeader";
import ProductForm from "../_components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="p-6">
      <PageHeader>Add Product</PageHeader>
      <div className="mt-6">
        <ProductForm />
      </div>
    </div>
  );
}