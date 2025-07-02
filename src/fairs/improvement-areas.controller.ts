import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { CreateImprovementAreaDto } from './dto/create-improvement-area.dto'
import { ImprovementAreasService } from './improvement-areas.service'

@Controller('improvement-areas')
export class ImprovementAreasController {
  constructor(
    private readonly improvementAreasService: ImprovementAreasService,
  ) {}

  @Post('fairs/:fairId/improvements')
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: CreateImprovementAreaDto,
  ) {
    const user = req.user!
    return this.improvementAreasService.create(fairId, user.id, dto)
  }

  @Get('fairs/:fairId/improvements')
  findByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.improvementAreasService.findByFair(fairId, user)
  }

  @Patch('improvements/:id')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: CreateImprovementAreaDto,
  ) {
    const user = req.user!
    return this.improvementAreasService.update(id, user.id, dto)
  }
}
