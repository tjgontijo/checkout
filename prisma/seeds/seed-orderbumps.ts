import { PrismaClient } from '@prisma/client';

interface ProductWithStore {
  id: string;
  name: string;
  price: number;
  storeId: string;
  store?: {
    id: string;
    name: string;
  } | null;
}

export async function seedOrderBumps(prisma: PrismaClient) {

  const existingOrderBump = await prisma.orderBump.findFirst();
  if (existingOrderBump) {
    console.log('Order bumps já existem, pulando criação');
    return;
  }

  const produtos = await prisma.product.findMany({
    where: { 
      isActive: true, 
      deletedAt: null 
    },
    select: {
      id: true,
      name: true,
      price: true,
      storeId: true,
      store: {
        select: {
          id: true,
          name: true
        }
      },
      createdAt: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  }) as unknown as ProductWithStore[];

  // Se tiver menos de 2 produtos, não faz nada
  if (produtos.length < 2) {
    console.log('Menos de 2 produtos encontrados. Nenhum orderbump criado.');
    return;
  }

  // Agrupa produtos por loja
  const produtosPorLoja: Record<string, ProductWithStore[]> = {};
  
  produtos.forEach((produto) => {
    if (!produtosPorLoja[produto.storeId]) {
      produtosPorLoja[produto.storeId] = [];
    }
    produtosPorLoja[produto.storeId].push(produto);
  });
 
  for (const [storeId, produtosDaLoja] of Object.entries(produtosPorLoja)) {
    if (produtosDaLoja.length < 2) {
      console.log(`Loja ${produtosDaLoja[0]?.store?.name || storeId} tem menos de 2 produtos. Pulando.`);
      continue;
    }

    // O primeiro produto é considerado o principal
    const produtoPrincipal = produtosDaLoja[0];
    
    // Array para armazenar os produtos que serão usados como orderbumps
    const orderBumps = produtosDaLoja.slice(1, 3); // Pega os próximos 2 produtos

    console.log(`Criando ${orderBumps.length} order bump(s) para a loja ${produtoPrincipal.store?.name || storeId}...`);

    // Cria os orderbumps baseado nos produtos disponíveis
    await Promise.all(
      orderBumps.map(async (bump, index: number) => {
        try {
          const isFirstBump = index === 0;
          const displayOrder = index + 1;
          const discount = isFirstBump ? 0.5 : 0.4; // 50% para o primeiro, 40% para o segundo
          const specialPrice = Math.floor(bump.price * (1 - discount));
          
          await prisma.orderBump.create({
            data: {
              mainProductId: produtoPrincipal.id,
              bumpProductId: bump.id,
              title: `Leve junto: ${bump.name}`,
              description: `Aproveite este produto com ${discount * 100}% de desconto!`,
              specialPrice: specialPrice,
              displayOrder: displayOrder,
              isActive: true,
            }
          });
          
          console.log(`✅ Order bump criado para o produto: ${bump.name} (${discount * 100}% de desconto)`);
        } catch (error) {
          console.error(`❌ Erro ao criar order bump para o produto ${bump.name}:`, error);
        }
      })
    );

    console.log(`✅ ${orderBumps.length} order bump(s) criado(s) com sucesso para a loja ${produtoPrincipal.store?.name || storeId}!`);
  }
}