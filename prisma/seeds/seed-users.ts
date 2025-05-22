import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { faker } from '@faker-js/faker/locale/pt_BR';

const prisma = new PrismaClient();

function generateRandomUser(_index: number) {
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();

  return {
    fullName: `${firstName} ${lastName}`,
    phoneNumber: `${faker.string.numeric(2)}9${faker.string.numeric(4)}${faker.string.numeric(4)}`,
    email: faker.internet.email({ firstName, lastName }),
    emailVerified: faker.datatype.boolean() ? faker.date.past({ years: 2 }) : null,
    password: '', // será preenchido depois com hash
    lastLoginAt: faker.date.recent({ days: 30 }),
    createdAt: faker.date.past({ years: 1 }),
    updatedAt: new Date(),
  };
}

async function createAdminUser() {
  // Buscar a role ADMIN existente
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } });
  if (!adminRole) throw new Error('Role ADMIN não encontrada. Execute o seed de roles primeiro.');

  const password = await hash('admin123', 10);
  await prisma.user.create({
    data: {
      fullName: 'Thiago Gontijo',
      phoneNumber: '61982482100',
      email: 'tjgontijo@gmail.com',
      emailVerified: new Date(),
      password,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
      roles: {
        connect: [{ id: adminRole.id }],
      },
    },
  });
}

// Criação de usuários regulares
async function createRegularUsers(qtd = 4) {
  const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
  if (!userRole) throw new Error('Role USER não encontrada. Execute o seed de roles primeiro.');

  for (let i = 0; i < qtd; i++) {
    const user = generateRandomUser(i);
    user.password = await hash('user123', 10);
    await prisma.user.create({
      data: {
        ...user,
        roles: {
          connect: [{ id: userRole.id }],
        },
      },
    });
  }
}

export async function seedUsers() {
  try {
    await createAdminUser();
    await createRegularUsers();
  } catch {
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
