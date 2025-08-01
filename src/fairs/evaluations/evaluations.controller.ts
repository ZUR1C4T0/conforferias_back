import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '@/auth/decorators/roles.decorator'
import { EvaluateFairDto } from './dto/evaluate-fair.dto'
import { EvaluationsService } from './evaluations.service'

@Controller('fairs/:fairId/evaluations')
@ApiBearerAuth()
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Put()
  @Roles(UserRole.REPRESENTANTE)
  upsert(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: EvaluateFairDto,
  ) {
    const user = req.user!
    return this.evaluationsService.upsert(fairId, user.id, dto)
  }

  @Get('own')
  @Roles(UserRole.REPRESENTANTE)
  findOwnEvaluation(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.evaluationsService.findOwnEvaluation(fairId, user.id)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  findAllByFair(@Param('fairId') fairId: string) {
    return this.evaluationsService.findAllByFair(fairId)
  }
}
