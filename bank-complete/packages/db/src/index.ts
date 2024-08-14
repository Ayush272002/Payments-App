import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const prismaClientSingleton = (databaseUrl: string) => {
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  }).$extends(withAccelerate());

  // Returning the client directly ensures all models, including `User`, are accessible.
  return client;
};

export default prismaClientSingleton;
