"use client";

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/formatters";
import { addProduct } from "../../_actions/products";

export default function ProductForm() {
  const [priceInCents, setPriceInCents] = useState<number>(0);

  return (
    <div className="mx-auto p-6 bg-white border-1 rounded-2xl shadow-md space-y-8">
      <form className="space-y-6" action={addProduct}>
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base font-medium">
            Product Name
          </Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Enter product name"
            required
          />
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
          />
          <div className="text-muted-foreground">{ formatCurrency((priceInCents || 0) / 100) }</div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-base font-medium">
            Description
          </Label>
          <Textarea id="description" name="description" required />
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
            required
          />
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
            required
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="w-34 cursor-pointer">
            Submit Product
          </Button>
        </div>
      </form>
    </div>
  );
}
