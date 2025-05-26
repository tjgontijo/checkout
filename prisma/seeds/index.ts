import { PrismaClient } from '@prisma/client';
import { seedUsers } from './seed-users';
import { initialRoles } from './seed-roles';
import { initialResources } from './seed-resources';
import { initialActions } from './seed-actions';
import { initialPermissions } from './seed-permissions';
import { seedMenuItems } from './seed-menu-items';
import { seedRolePermissions } from './seed-role-permission';
import logger from '@/lib/logger';
import { seedProducts } from './seed-products';
import { seedCheckouts } from './seed-checkouts';
import { seedOrderBumps } from './seed-orderbumps';
import { seedStores } from './seed-stores';
import { seedStorePaymentConfig } from './seed-store-payment';

const prisma = new PrismaClient();

async function cleanDatabase() {
  await prisma.auditLog.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.action.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.session.deleteMany();
  await prisma.token.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.product.deleteMany();
  await prisma.checkout.deleteMany();
  await prisma.orderBump.deleteMany();
  await prisma.storePaymentConfig.deleteMany();
}

async function createInitialData() {
  logger.info('Cleaning database...');
  await cleanDatabase();
  logger.info('Database cleaned.');

  try {
    await prisma.action.createMany({ data: initialActions });
    logger.info('Actions created');

    await prisma.resource.createMany({ data: initialResources });
    logger.info('Resources created');

    await prisma.role.createMany({ data: initialRoles });
    logger.info('Roles created');

    // Primeiro cria as stores
    await seedStores(prisma);
    logger.info('Stores criadas');

    // Configurações de pagamento para as lojas
    await seedStorePaymentConfig(prisma);
    logger.info('Configurações de pagamento criadas');

    // Depois os produtos que dependem das stores
    await seedProducts(prisma);
    logger.info('Products created');

    await seedCheckouts(prisma);
    logger.info('Checkouts created');
    
    await seedOrderBumps(prisma);
    logger.info('OrderBumps created');

    // Buscar recursos e ações para mapear seus IDs
    const resources = await prisma.resource.findMany();
    const actions = await prisma.action.findMany();

    // Criar permissões com IDs corretos
    const permissionsToCreate = initialPermissions
      .map((permission) => {
        const resourceName = permission.resource?.connect?.name;
        const actionName = permission.action?.connect?.name;

        if (!resourceName || !actionName) {
          logger.warn(`Skipping invalid permission: ${permission.name}`);
          return null;
        }

        const resourceId = resources.find((r: { name: string }) => r.name === resourceName)?.id;
        const actionId = actions.find((a: { name: string }) => a.name === actionName)?.id;

        if (!resourceId || !actionId) {
          logger.warn(`Could not find resource or action for: ${permission.name}`);
          return null;
        }

        return {
          name: permission.name,
          description: permission.description,
          resourceId,
          actionId,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    await prisma.permission.createMany({ data: permissionsToCreate });
    logger.info('Permissions created');

    // Seed Role Permissions para ADMIN
    await seedRolePermissions(prisma);
    logger.info('Role Permissions created');

    await seedMenuItems();
    logger.info('Menu items created');

    await seedUsers();
    logger.info('Users created');
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error during seed creation: ${error.message}`);
    } else {
      logger.error(`Unknown error during seed creation: ${String(error)}`);
    }
    throw error; // Garante que o erro será propagado
  }
}

createInitialData()
  .catch((error) => {
    if (error instanceof Error) {
      logger.error(`Seed failed: ${error.message}`);
    } else {
      logger.error(`Unknown seed failure: ${String(error)}`);
    }
  })
  .finally(() => {
    prisma.$disconnect();
    logger.info('Prisma client disconnected.');
  });
