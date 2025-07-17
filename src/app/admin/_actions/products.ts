"use server";

import { z } from "zod";
import fs from "fs/promises"
import db from "@/config/db";
import { notFound, redirect } from "next/navigation";

const fileLike = z.object({
  name: z.string().min(1, "Required"),
  size: z.number().min(1, "Required"),
  type: z.string().optional(),
});

const imageLike = fileLike.refine(file => !file.type || file.type.startsWith("image/"), {
  message: "File must be an image",
});

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  file: fileLike,
  image: imageLike,
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const file = formData.get("file");
  const image = formData.get("image");

  const fileObj = file && typeof file === "object" && "name" in file && "size" in file ? {
    name: file.name,
    size: file.size,
    type: file.type,
  } : { name: "", size: 0, type: "" };
  const imageObj = image && typeof image === "object" && "name" in image && "size" in image ? {
    name: image.name,
    size: image.size,
    type: image.type,
  } : { name: "", size: 0, type: "" };

  const result = addSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    priceInCents: formData.get("priceInCents"),
    file: fileObj,
    image: imageObj,
  });
  if (!result.success) {
    return result.error.flatten().fieldErrors;
  }

  const data = result.data;

  await fs.mkdir("products", { recursive: true });
  const filePath = `products/${crypto.randomUUID()}-${fileObj.name}`;
  if (file && typeof (file as any).arrayBuffer === "function") {
    await fs.writeFile(filePath, Buffer.from(await (file as Blob).arrayBuffer()));
  } else {
    throw new Error("File upload failed or not supported");
  }

  await fs.mkdir("public/products", { recursive: true });
  const imagePath = `products/${crypto.randomUUID()}-${imageObj.name}`;
  if (image && typeof (image as any).arrayBuffer === "function") {
    await fs.writeFile(`public/${imagePath}`, Buffer.from(await (image as Blob).arrayBuffer()));
  } else {
    throw new Error("Image upload failed or not supported");
  }

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      filePath,
      imagePath,
    },
  });

  redirect("/admin/products");
}

export async function toggleProductAvailability(id: string, isAvailableForPurchase: boolean) {
  await db.product.update({ where: { id }, data: { isAvailableForPurchase } });
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (product == null)
    return notFound();

  await fs.unlink(product.filePath);
  await fs.unlink(`public/${product.imagePath}`);
}