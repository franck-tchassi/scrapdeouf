// prismadb.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Déclaration globale pour éviter la recréation de PrismaClient en développement
declare global {
  var prismaGlobal: PrismaClient | undefined;
}

// Utilisation du singleton ou de l'instance globale existante
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// En mode développement, on conserve l'instance dans globalThis pour éviter de recréer l'instance à chaque requête
if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}