import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { CreateTrendDto } from './dto/create-trend.dto'
import { TrendsService } from './trends.service'

@Controller('')
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @Post('fairs/:fairId/trends')
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: CreateTrendDto,
  ) {
    const user = req.user!
    return this.trendsService.create(fairId, user.id, dto)
  }

  @Get('fairs/:fairId/trends')
  findByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.trendsService.findByFair(fairId, user)
  }

  @Patch('trends/:id')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: CreateTrendDto,
  ) {
    const user = req.user!
    return this.trendsService.update(id, user.id, dto)
  }
}
