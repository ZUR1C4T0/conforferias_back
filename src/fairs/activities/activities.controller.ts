import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '@/auth/decorators/roles.decorator'
import { ActivitiesService } from './activities.service'
import { CreateActivityDto } from './dto/create-activity.dto'
import { UpdateActivityDto } from './dto/update-activity.dto'

@Controller('fairs/:fairId/activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  create(
    @Param('fairId') fairId: string,
    @Body() createActivityDto: CreateActivityDto,
  ) {
    return this.activitiesService.create(fairId, createActivityDto)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  findAll(@Param('fairId') fairId: string) {
    return this.activitiesService.findAll(fairId)
  }

  @Patch(':activityId')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('fairId') fairId: string,
    @Param('activityId') activityId: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(fairId, activityId, updateActivityDto)
  }
}
