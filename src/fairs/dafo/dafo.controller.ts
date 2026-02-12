import { UserRole } from '@generated/prisma/client'
import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { ApiBearerAuth } from '@nestjs/swagger'
import { Request } from 'express'
import { Roles } from '@/auth/decorators/roles.decorator'
import { DafoService } from './dafo.service'
import { CreateDafoDto } from './dto/create-dafo.dto'
import { UpdateDafoDto } from './dto/update-dafo.dto'

@Controller('fairs/:fairId/dafo')
@ApiBearerAuth()
export class DafoController {
  constructor(private readonly dafoService: DafoService) {}

  @Post()
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() createDafoDto: CreateDafoDto,
  ) {
    const user = req.user!
    return this.dafoService.create(fairId, user.id, createDafoDto)
  }

  @Get()
  findAll(@Param('fairId') fairId: string) {
    return this.dafoService.findAll(fairId)
  }

  @Patch(':dafoId')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('fairId') fairId: string,
    @Param('dafoId') dafoId: string,
    @Req() req: Request,
    @Body() updateDafoDto: UpdateDafoDto,
  ) {
    const user = req.user!
    return this.dafoService.update(fairId, dafoId, user.id, updateDafoDto)
  }
}
