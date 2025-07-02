import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { CompetitorsService } from './competitors.service'
import { CreateCompetitorDto } from './dto/create-competitor.dto'

@Controller('')
export class CompetitorsController {
  constructor(private readonly competitorsService: CompetitorsService) {}

  @Post('fairs/:fairId/competitors')
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: CreateCompetitorDto,
  ) {
    const user = req.user!
    return this.competitorsService.create(fairId, user.id, dto)
  }

  @Get('fairs/:fairId/competitors')
  findByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.competitorsService.findByFair(fairId, user)
  }

  @Get('competitors/:id')
  findOne(@Param('id') id: string) {
    return this.competitorsService.findOne(id)
  }

  @Patch('competitors/:id')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: CreateCompetitorDto,
  ) {
    const user = req.user!
    return this.competitorsService.update(id, user.id, dto)
  }
}
