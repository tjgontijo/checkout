import { PrismaClient } from '@prisma/client';

export const initialStores = [
  {
    name: 'Prof Didática',
  },
];

export async function seedStores(prisma: PrismaClient) {
  const store = await prisma.store.findFirst();
  
  if (!store) {
    const adminUser = await prisma.user.findFirst({
      where: { email: 'tjgontijo@gmail.com' },
    });

    if (!adminUser) {
      throw new Error('Usuário admin não encontrado para vincular à loja');
    }

    await prisma.store.createMany({
      data: initialStores.map(store => ({
        ...store,
        ownerId: adminUser.id,
      })),
    });
    
    console.log('Stores criadas com sucesso');
  } else {
    console.log('Stores já existem, pulando criação');
  }
  
  return prisma.store.findFirst();
}
