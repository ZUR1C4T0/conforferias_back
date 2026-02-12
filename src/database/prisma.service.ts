import { Prisma, PrismaClient } from '@generated/prisma/client'
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
    const adapter = new PrismaMariaDb(process.env.DATABASE_URL!)
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
