import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { PrismaService } from '../database/prisma.service'

@Injectable()
export class ClearSessionsService {
  private readonly logger = new Logger(ClearSessionsService.name)

  constructor(private readonly prisma: PrismaService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'clear-sessions',
    timeZone: 'America/Bogota',
  })
  async handleCron() {
    try {
      this.logger.log('Ejecutando limpieza de sesiones expiradas')
      const { count } = await this.prisma.session.deleteMany({
        where: { expiresAt: { lt: new Date() } },
      })
      this.logger.log(`Se eliminaron ${count} sesiones expiradas`)
    } catch (error) {
      this.logger.error(
        `Error al limpiar sesiones: ${error.message}`,
        error.stack,
      )
    }
  }
}
