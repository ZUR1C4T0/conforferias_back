import { Body, Controller, Get, Param, Put, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { EvaluateFairDto } from './dto/evaluate-fair.dto'
import { FairEvaluationsService } from './fair-evaluations.service'

@Controller('fairs/:fairId')
export class FairEvaluationsController {
  constructor(
    private readonly fairEvaluationsService: FairEvaluationsService,
  ) {}

  @Put('evaluation')
  @Roles(UserRole.REPRESENTANTE)
  upsert(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: EvaluateFairDto,
  ) {
    const user = req.user!
    return this.fairEvaluationsService.upsert(fairId, user.id, dto)
  }

  @Get('evaluation')
  @Roles(UserRole.REPRESENTANTE)
  findOwnEvaluation(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.fairEvaluationsService.findOwnEvaluation(fairId, user.id)
  }

  @Get('evaluations')
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  findAllByFair(@Param('fairId') fairId: string) {
    return this.fairEvaluationsService.findAllByFair(fairId)
  }
}
