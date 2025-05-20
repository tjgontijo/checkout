import { UserTable } from "@/components/settings/users/UserTable";
import { prisma } from "@/lib/prisma";

export default async function UsersPage() {
  // Busca usuários e roles do banco
  const users = await prisma.user.findMany({
    include: { roles: true },
    orderBy: { fullName: "asc" },
  });
  
  const roles = await prisma.role.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuários</h1>
      <UserTable users={users} roles={roles} />
    </main>
  );
}
