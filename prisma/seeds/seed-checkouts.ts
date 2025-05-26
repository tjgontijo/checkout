import { PrismaClient } from '@prisma/client';

export async function seedCheckouts(prisma: PrismaClient) {
  // Verifica se já existem checkouts
  const existingCheckout = await prisma.checkout.findFirst();
  if (existingCheckout) {
    console.log('Checkouts já existem, pulando criação');
    return;
  }

  // Busca especificamente o produto 'Missão Literária' ativo
  const principal = await prisma.product.findFirst({
    where: { 
      name: 'Missão Literária',
      isActive: true, 
      deletedAt: null 
    },
    include: {
      store: true
    }
  });
  
  if (!principal) {
    throw new Error('Produto "Missão Literária" não encontrado ou não está ativo.');
  }

  console.log(`Criando checkout para o produto: ${principal.name} na loja: ${principal.store?.name || 'N/A'}`);

  // Cria o checkout principal
  await prisma.checkout.create({
    data: {
      productId: principal.id,
      isActive: true,
      campaignName: 'Campanha Principal',
      requiredFields: ['customerName', 'customerEmail', 'customerPhone'],
    }
  });

  console.log('Checkouts criados com sucesso');
}