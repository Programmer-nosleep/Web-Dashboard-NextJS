import { PrismaClient } from "@prisma/client/extension";

const prismaClientSingleton = () => {
  return new PrismaClient();
}


declare global {
  var prism: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prisma ?? prismaClientSingleton;
export default prisma;

if (process.env.NODE_ENV !== 'development') globalThis.prisma = prisma;