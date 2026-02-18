import { PrismaClient } from '@generated/prisma/client'
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

/**
 * PrismaService provides a Prisma client instance.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
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
    const prodEnv = process.env.NODE_ENV === 'production'
    super({
      adapter,
      log: ['warn', 'error', prodEnv ? 'info' : 'query'],
    })
  }

  async onModuleInit() {
    await this.$connect()
  }

  async onModuleDestroy() {
    await this.$disconnect()
  }
}
