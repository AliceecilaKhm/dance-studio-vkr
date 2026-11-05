import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { Role } from '../src/generated/prisma/enums';
import { PrismaPg } from '@prisma/adapter-pg';
import { hash } from 'argon2';


const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.findFirst({
    where: {
      role: Role.ADMIN,
    },
  });

  if (admin) {
    console.log('Администратор уже существует');
    return;
  }

  const adminLogin = process.env.ADMIN_LOGIN;
const adminPassword = process.env.ADMIN_PASSWORD;

if (!adminLogin || !adminPassword) {
  throw new Error('Не заданы данные администратора в .env');
}

if (
  adminPassword.length < 8 ||
  adminPassword.length > 128 ||
  !/[0-9]/.test(adminPassword)
) {
  throw new Error(
    'Пароль должен содержать от 8 до 128 символов и хотя бы одну цифру',
  );
}
const passwordHash = await hash(adminPassword);

await prisma.user.create({
  data: {
    login: adminLogin,
    passwordHash: passwordHash,
    role: Role.ADMIN,
    isActive: true,
  },
});

console.log('Администратор успешно создан');
}

main()
  .catch((error) => {
    console.error('Ошибка при создании администратора:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
