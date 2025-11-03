// types/index.ts
export type SafeUser = {
    id: string;
    name?: string | null;
    email?: string | null;
    emailVerified?: string | null;
    image?: string | null;
    hashedPassword?: string | null;
    createdAt: string;
    updatedAt: string;
  };