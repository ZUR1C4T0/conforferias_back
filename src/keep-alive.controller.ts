import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common'
import { Public } from './auth/decorators/public.decorator'
import { PrismaService } from './database/prisma.service'

@Controller('health')
export class KeepAliveController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  async healthCheck() {
    try {
      await this.prisma.$queryRaw`SELECT 1`
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      throw new HttpException(
        {
          status: 'error',
          database: 'disconnected',
          error: error.message,
          timestamp: new Date().toISOString(),
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      )
    }
  }
}
