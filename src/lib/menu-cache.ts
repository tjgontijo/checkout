'use server';

import { cache } from 'react';
import { prisma } from '@/lib/prisma';

// Função para buscar itens de menu com cache
export const getMenuItems = cache(async () => {
  console.log('Buscando itens de menu do banco de dados (com cache)');

  try {
    const menuItems = await prisma.menuItem.findMany({
      include: {
        permission: {
          include: {
            resource: true,
            action: true,
          },
        },
        parent: true,
        children: {
          include: {
            permission: true,
          },
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    return menuItems;
  } catch (error) {
    console.error('Erro ao buscar itens de menu:', error);
    return [];
  }
});
