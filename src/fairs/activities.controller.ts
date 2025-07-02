import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { ActivitiesService } from './activities.service'
import { CreateActivityDto } from './dto/create-activity.dto'
import { UpdateActivityDto } from './dto/update-activity.dto'

@Controller('')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post('fairs/:fairId/activities')
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    const user = req.user!
    return this.activitiesService.create(fairId, user.id, createActivityDto)
  }

  @Get('fairs/:fairId/activities')
  @Roles(UserRole.ADMIN, UserRole.MERCADEO, UserRole.REPRESENTANTE)
  findAll(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.activitiesService.findByFair(fairId, user)
  }

  @Patch('activities/:id')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    const user = req.user!
    return this.activitiesService.update(id, user.id, updateActivityDto)
  }
}
