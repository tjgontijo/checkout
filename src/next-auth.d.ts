import { DefaultSession } from "next-auth";

// Extende a tipagem do NextAuth para incluir o campo id no user da session

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      roles?: string[];
      permissions?: string[];
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    roles?: string[];
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles?: string[];
    permissions?: string[];
  }
}
