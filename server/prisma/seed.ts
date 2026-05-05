// server/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando el sembrado de datos (Seeding)...');

  // 1. Limpiamos la tabla para no duplicar datos si lo corremos varias veces
  await prisma.lead.deleteMany();

  // 2. Inyectamos los leads exactos de tu portafolio
  const leads = await prisma.lead.createMany({
    data: [
      // COLUMNA: NUEVO
      { name: 'David Mercado', email: 'david@referido.com', source: 'Referido', status: 'NUEVO' },
      { name: 'Josue Mendez', email: 'josue@referido.com', source: 'Referido', status: 'NUEVO' },
      { name: 'Jared Ozono Moreno', email: 'jared@linkedin.com', source: 'LinkedIn', status: 'NUEVO' },
      
      // COLUMNA: CONTACTADO
      { name: 'Antonio Pérez', email: 'antonio@web.com', source: 'Web', status: 'CONTACTADO' },
      { name: 'Otniel Murillo', email: 'otniel@otro.com', source: 'Otro', status: 'CONTACTADO' },
      
      // COLUMNA: NEGOCIACION
      { name: 'Ivan', email: 'ivan@linkedin.com', source: 'LinkedIn', status: 'NEGOCIACION' },
      { name: 'Jose Perez', email: 'jose@linkedin.com', source: 'LinkedIn', status: 'NEGOCIACION' },
      
      // COLUMNA: CERRADO
      { name: 'Veronica Moreno', email: 'veronica@linkedin.com', source: 'LinkedIn', status: 'CERRADO' },
      { name: 'Adrian Perez', email: 'adrian@web.com', source: 'Web', status: 'CERRADO' },
      { name: 'Carlitos Aguirre', email: 'carlitos@referido.com', source: 'Referido', status: 'CERRADO' },
    ],
  });

  console.log(`✅ ¡Éxito! Se han inyectado ${leads.count} prospectos en Neon DB.`);
}

main()
  .catch((e) => {
    console.error('❌ Error al poblar la base de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });