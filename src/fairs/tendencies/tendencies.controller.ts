import { UserRole } from '@generated/prisma/client'
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { Roles } from '@/auth/decorators/roles.decorator'
import { CreateTendencyDto } from './dto/create-tendency.dto'
import { UpdateTendencyDto } from './dto/update-tendency.dto'
import { TendenciesService } from './tendencies.service'

@Controller('fairs/:fairId/tendencies')
@ApiBearerAuth()
export class TendenciesController {
  constructor(private readonly tendenciesService: TendenciesService) {}

  @Post()
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: CreateTendencyDto,
  ) {
    const user = req.user!
    return this.tendenciesService.create(fairId, user.id, dto)
  }

  @Get()
  findByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.tendenciesService.findByFair(fairId, user.id)
  }

  @Patch(':tendencyId')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('fairId') fairId: string,
    @Param('tendencyId') tendencyId: string,
    @Req() req: Request,
    @Body() dto: UpdateTendencyDto,
  ) {
    const user = req.user!
    return this.tendenciesService.update(fairId, tendencyId, user.id, dto)
  }
}
