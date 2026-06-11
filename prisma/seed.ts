import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import * as bcrypt from 'bcrypt'
import { PrismaClient } from '../src/generated/prisma/client'

const url = new URL(process.env.DATABASE_URL!)
const adapter = new PrismaMariaDb({
  host: url.hostname,
  port: Number(url.port),
  user: url.username,
  password: url.password,
  database: url.pathname.slice(1),
  connectTimeout: 5000,
  allowPublicKeyRetrieval: true,
})
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🚀 Iniciando seed...')

  // --- Crear el usuario administrador ---
  await prisma.user.create({
    data: {
      name: 'Ivan Ulloque',
      email: 'webmaster2@confortfresh.com',
      password: bcrypt.hashSync('admin123', 12),
      role: 'ADMIN',
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
