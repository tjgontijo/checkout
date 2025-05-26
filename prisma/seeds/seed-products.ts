import { PrismaClient } from '@prisma/client';

export async function seedProducts(prisma: PrismaClient) {
  // Primeiro, verifica se já existem produtos
  const existingProduct = await prisma.product.findFirst();
  if (existingProduct) {
    console.log('Produtos já existem, pulando criação');
    return;
  }

  // Busca a primeira loja disponível
  const store = await prisma.store.findFirst();
  if (!store) {
    throw new Error('Nenhuma loja encontrada. Execute o seed de stores primeiro.');
  }

  const initialProducts = [
    {
      name: 'Missão Literária',
      description: 'Recurso para estimular a leitura em sala de aula',
      price: 1200,
      priceCurrency: 'BRL',
      imageUrl: 'https://images.yampi.me/assets/stores/prof-didatica/uploads/images/missao-literaria-6816b39652f7c-large.jpg',
      salesPageUrl: 'https://lp.profdidatica.com.br/missao-literaria',
      storeId: store.id,
    },
    {
      name: '40 textos para o recurso Missão Literária',
      description: 'Coletânia de textos exclusivos para serem utilizados com o recurso Missão Literária',
      price: 600,
      priceCurrency: 'BRL',
      imageUrl: 'https://images.yampi.me/assets/stores/prof-didatica/uploads/images/textos-para-missoes-literarias-682a6a97af294-large.png',
      salesPageUrl: 'https://lp.profdidatica.com.br/40-textos',
      storeId: store.id,
    },
    {
      name: 'Apostila de Interpretação de Textos',
      description: 'Coletânia de textos e atividades exclusivas para aprimorar a interpretação de texto dos seus alunos',     
      price: 600,
      priceCurrency: 'BRL',
      imageUrl: 'https://images.yampi.me/assets/stores/prof-didatica/uploads/images/aventuras-na-leitura-textos-e-atividades-de-interpretacao-para-criancas-665f619c31726-large.jpg',
      salesPageUrl: 'https://lp.profdidatica.com.br/apostila-interpretacao-de-textos',
      storeId: store.id,
    },
  ];

  await prisma.product.createMany({
    data: initialProducts,
  });

  console.log('Produtos criados com sucesso');
}
