import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Iniciando seed...')

  // --- Cargo par el administrador ---
  const position = await prisma.position.create({
    data: { name: 'Programador Web' },
    select: { id: true },
  })

  // --- Crear el usuario administrador ---
  await prisma.user.create({
    data: {
      name: 'Ivan Ulloque',
      email: 'webmaster2@confortfresh.com',
      password: bcrypt.hashSync('admin123', 10),
      role: 'ADMIN',
      positionId: position.id,
    },
  })

  // --- Crear perfiles de contactos ---
  await prisma.contactProfile.createMany({
    data: [
      { name: 'Constructores' },
      { name: 'Comercializadores / Distribuidores' },
      { name: 'Arquitectos' },
      { name: 'Diseñadores Industriales' },
      { name: 'Empresa instaladora' },
      { name: 'Empresa de Ingeniería y Consultas' },
      { name: 'Personas independientes' },
      { name: 'Técnicos' },
      { name: 'Sector Salud' },
      { name: 'Otros' },
    ],
    skipDuplicates: true,
  })

  console.log('✅ Seed ejecutado correctamente ✅')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
