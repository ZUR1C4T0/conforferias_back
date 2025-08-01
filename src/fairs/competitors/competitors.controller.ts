import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '@/auth/decorators/roles.decorator'
import { CompetitorsService } from './competitors.service'
import { CreateCompetitorDto } from './dto/create-competitor.dto'

@Controller('fairs/:fairId/competitors')
@ApiBearerAuth()
export class CompetitorsController {
  constructor(private readonly competitorsService: CompetitorsService) {}

  @Post()
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: CreateCompetitorDto,
  ) {
    const user = req.user!
    return this.competitorsService.create(fairId, user.id, dto)
  }

  @Get()
  findAll(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.competitorsService.findAll(fairId, user)
  }

  @Get(':competitorId')
  findOne(
    @Param('fairId') fairId: string,
    @Param('competitorId') competitorId: string,
    @Req() req: Request,
  ) {
    const user = req.user!
    return this.competitorsService.findOne(fairId, competitorId, user)
  }

  @Patch(':comptitorId')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('fairId') fairId: string,
    @Param('competitorId') competitorId: string,
    @Req() req: Request,
    @Body() dto: CreateCompetitorDto,
  ) {
    const user = req.user!
    return this.competitorsService.update(fairId, competitorId, user.id, dto)
  }
}
