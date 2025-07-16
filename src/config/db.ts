// import { PrismaClient } from "@prisma/client/extension";
import { PrismaClient } from "@/generated/prisma";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  // agar tidak error saat diulang di HMR (Hot Module Replacement)
  var db: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.db ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.db = prisma;
}

export default prisma;
