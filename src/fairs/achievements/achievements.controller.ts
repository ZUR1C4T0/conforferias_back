import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '@/auth/decorators/roles.decorator'
import { AchievementsService } from './achievements.service'
import { CreateAchievementDto } from './dto/create-achievement.dto'
import { UpdateAchievementDto } from './dto/update-achievement.dto'

@Controller('fairs/:fairId/achievements')
export class AchievementsController {
  constructor(private readonly achievementService: AchievementsService) {}

  @Post()
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: CreateAchievementDto,
  ) {
    const user = req.user!
    return this.achievementService.create(fairId, user.id, dto)
  }

  @Get()
  findByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.achievementService.findByFair(fairId, user)
  }

  @Patch(':achievementId')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('achievementId') id: string,
    @Req() req: Request,
    @Body() dto: UpdateAchievementDto,
  ) {
    const user = req.user!
    return this.achievementService.update(id, user.id, dto)
  }
}
