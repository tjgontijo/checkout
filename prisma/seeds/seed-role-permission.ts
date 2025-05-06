import { PrismaClient } from '@prisma/client'

export async function seedRolePermissions(prisma: PrismaClient) {
  try {
    // Buscar a role ADMIN
    const adminRole = await prisma.role.findUnique({
      where: { name: 'ADMIN' }
    })

    if (!adminRole) {
      return
    }

    // Buscar todas as permissões
    const allPermissions = await prisma.permission.findMany()

    // Criar RolePermissions para ADMIN
    const rolePermissionsToCreate = allPermissions.map((permission: { id: string }) => ({
      roleId: adminRole.id,
      permissionId: permission.id,
      grantedBy: 'system-seed'
    }))

    // Criar RolePermissions em lote
    await prisma.rolePermission.createMany({
      data: rolePermissionsToCreate,
      skipDuplicates: true // Evita duplicatas
    })
  } catch (error) {
    throw error
  }
}