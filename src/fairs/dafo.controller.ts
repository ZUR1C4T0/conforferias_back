import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { DafoService } from './dafo.service'
import { CreateDafoDto } from './dto/create-dafo.dto'
import { UpdateDafoDto } from './dto/update-dafo.dto'

@Controller('')
export class DafoController {
  constructor(private readonly dafoService: DafoService) {}

  @Post('fairs/:fairId/dafo')
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() createDafoDto: CreateDafoDto,
  ) {
    const user = req.user!
    return this.dafoService.create(fairId, user.id, createDafoDto)
  }

  @Get('fairs/:fairId/dafo')
  findAll(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.dafoService.findAll(fairId, user)
  }

  @Patch('dafo/:id')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateDafoDto: UpdateDafoDto,
  ) {
    const user = req.user!
    return this.dafoService.update(id, user.id, updateDafoDto)
  }
}
