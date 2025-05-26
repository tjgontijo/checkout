import { PrismaClient } from '@prisma/client';

export async function seedStorePaymentConfig(prisma: PrismaClient) {
  // Verifica se já existem configs
  const existingConfig = await prisma.storePaymentConfig.findFirst();
  if (existingConfig) {
    console.log('StorePaymentConfig já existe, pulando criação');
    return;
  }

  // Busca a primeira loja disponível
  const store = await prisma.store.findFirst();
  if (!store) {
    throw new Error('Nenhuma loja encontrada. Execute o seed de stores primeiro.');
  }

  const configs = [
    {
      storeId: store.id,
      paymentMethod: 'pix',
      currency: 'BRL',
      provider: 'mercado_pago',
      config: {
        public_key: 'APP_USR-4bc818f1-b6bb-4af8-94e8-4307c34853a8',
        access_token: 'APP_USR-482384492857870-050711-371e055c1b45b50bd0d02fd7533cd772-716380766',
      }
    },
    {
      storeId: store.id,
      paymentMethod: 'credit_card',
      currency: 'BRL',
      provider: 'mercado_pago',
      config: {
        public_key: 'APP_USR-4bc818f1-b6bb-4af8-94e8-4307c34853a8',
        access_token: 'APP_USR-482384492857870-050711-371e055c1b45b50bd0d02fd7533cd772-716380766',
      }
    }    
  ];

  await prisma.storePaymentConfig.createMany({
    data: configs,
  });

  console.log('StorePaymentConfig criado com sucesso');
}
