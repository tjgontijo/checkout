import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import type { User } from 'next-auth';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Adiciona informações do usuário ao token
        token.id = user.id;
        token.roles = user.roles;
        token.permissions = user.permissions;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.roles = token.roles as string[];
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Credenciais incompletas');
          return null;
        }

        try {
          // Busca usuário com roles e permissões
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              roles: {
                include: {
                  permissions: {
                    include: { permission: true },
                  },
                },
              },
            },
          });

          // Verifica se o usuário existe
          if (!user || !user.password) {
            console.log('Usuário não encontrado ou sem senha:', credentials.email);
            return null;
          }

          // Valida a senha
          const isPasswordValid = await compare(credentials.password, user.password);
          if (!isPasswordValid) {
            console.log('Senha inválida para:', credentials.email);
            return null;
          }

          // Extrai permissões das roles
          const permissions = user.roles.flatMap((role) =>
            role.permissions.map((p) => p.permission.name)
          );

          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            roles: user.roles.map((role) => role.name),
            permissions: [...new Set(permissions)], // Remove permissões duplicadas
          } as User;
        } catch (error) {
          console.error('Erro durante autenticação:', error);
          return null;
        }
      },
    }),
  ],
};
