import { PrismaClient } from '@prisma/client';

// Fonction pour créer une nouvelle instance de Prisma
const createPrismaClient = () => {
  return new PrismaClient();
};

// Utilisation d'un singleton pour Prisma
const prisma = globalThis.prismaGlobal ?? createPrismaClient();
export default prisma;

// Stocker l'instance dans globalThis en mode développement
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}