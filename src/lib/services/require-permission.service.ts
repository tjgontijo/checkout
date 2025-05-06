import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Verifica se o usuário autenticado possui uma permissão específica.
 * @param permissionName Nome da permissão no formato 'recurso.ação'
 * @param errorMessage Mensagem de erro personalizada (opcional)
 * @returns Dados completos do usuário se ele tiver a permissão
 * @throws Error se o usuário não estiver autenticado ou não tiver permissão
 */
export async function requirePermission(permissionName: string, errorMessage?: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw new Error("Você precisa estar autenticado para realizar esta ação");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      roles: {
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const hasPermission = user.roles.some(role =>
    role.permissions.some(rp =>
      rp.permission.name === permissionName
    )
  );

  if (!hasPermission) {
    throw new Error(errorMessage || `Você não tem permissão para realizar esta ação (${permissionName})`);
  }

  return user;
}
