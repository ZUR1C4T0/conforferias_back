import { UserRole } from '@generated/prisma/client'
import { Controller, Get, Param } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Roles } from '@/auth/decorators/roles.decorator'
import { DashboardService } from './dashboard.service'

@Controller('fairs')
@ApiBearerAuth()
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get(':fairId/dashboard')
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  getDashboard(@Param('fairId') fairId: string) {
    return this.dashboardService.getDashboard(fairId)
  }
}
