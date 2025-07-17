"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { addProduct } from "../../_actions/products";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Product } from "@/generated/prisma/client";

export default function ProductForm({ product }: { product?: Product | null}) {
  const [priceInCents, setPriceInCents] = useState<number | undefined>(product?.priceInCents);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [actionResult, action] = useActionState(addProduct, {});

  const isError = actionResult && !('filePath' in actionResult);
  const error = isError ? actionResult as Record<string, string[]> : {};
  const filePath = !isError && actionResult ? actionResult.filePath : product?.filePath;
  const imagePath = !isError && actionResult ? actionResult.imagePath : product?.imagePath;

  return (
    <div className="mx-auto p-6 bg-white border-1 rounded-2xl shadow-md space-y-8">
      <form className="space-y-6" action={action}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium">
            Product Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Enter product name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            defaultValue={product?.name || ""}
          />
          { error.name && <div className="text-destructive">{error.name}</div> }
        </div>

        <div className="space-y-2">
          <Label htmlFor="priceInCents" className="text-base font-medium">
            Price 
          </Label>
          <Input
            type="number"
            id="priceInCents"
            name="priceInCents"
            placeholder="Enter number of price"
            value={priceInCents}
            onChange={e => setPriceInCents(Number(e.target.value))}
            required
            defaultValue={product?.priceInCents || 0}
          />
          <div className="text-muted-foreground">{ formatCurrency((priceInCents || 0) / 100) }</div>
          { error.priceInCents && <div className="text-destructive">{error.priceInCents}</div> }
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">
            Description
          </Label>
          <Textarea 
            id="description" 
            name="description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
            defaultValue={product?.description}
          />
          { error.description && <div className="text-destructive">{error.description}</div> }
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="file" className="text-base font-medium">
            File
          </Label>
          <Input
            type="file"
            id="file"
            name="file"
            placeholder="Enter product file"
            required={product == null}
          />
          {/* Tampilkan filePath jika ada di hasil action */}
          {filePath != null && (
            <div className="text-muted-foreground text-sm">
              {filePath}
            </div>
          )}
          { error.file && <div className="text-destructive">{error.file}</div> }
        </div>

        <div className="space-y-2">
          <Label htmlFor="image" className="text-base font-medium">
            Image
          </Label>
          <Input
            type="file"
            id="image"
            name="image"
            placeholder="Enter product image"
            required={product == null}
          />
          {/* Tampilkan imagePath jika ada di hasil action */}
          {imagePath != null && (
            <div className="text-muted-foreground text-sm">
              {imagePath}
            </div>
          )}
          { error.image && <div className="text-destructive">{error.image}</div> }
        </div>

        <div className="flex justify-end">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-34 cursor-pointer" disabled={pending}>
      {pending ? "Saving..." : "Submit Product"}
    </Button>
  );
}