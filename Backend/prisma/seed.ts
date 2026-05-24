import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding default users...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Database cleared.');
  const saltRounds = 10;
  const adminPassword = await bcrypt.hash('admin123', saltRounds);
  const userPassword = await bcrypt.hash('user123', saltRounds);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@toko.com',
      name: 'Admin Utama',
      password: adminPassword,
      role: Role.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      email: 'andhika@customer.com',
      name: 'Andhika Dwi',
      password: userPassword,
      role: Role.USER,
    },
  });
  await prisma.cart.create({
    data: {
      userId: customer.id,
    },
  });

  console.log('👤 Default accounts created successfully:');
  console.table([
    { Email: admin.email, Role: admin.role, Password: 'admin123' },
    { Email: customer.email, Role: customer.role, Password: 'user123' }
  ]);
  
  console.log('🚀 Database is ready! login sebagai admin untuk menambah produk asli.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });