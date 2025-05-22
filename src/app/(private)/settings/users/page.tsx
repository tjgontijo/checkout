import { UserTable } from '@/components/dashboard/settings/users/UserTable';
import { prisma } from '@/lib/prisma';

export default async function UsersPage() {
  // Busca usuários e roles do banco
  const users = await prisma.user.findMany({
    include: { roles: true },
    orderBy: { fullName: 'asc' },
  });

  const roles = await prisma.role.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <main className="p-6">
      <h1 className="mb-4 text-2xl font-bold">Usuários</h1>
      <UserTable users={users} roles={roles} />
    </main>
  );
}
