import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { AchievementService } from './achievement.service'
import { CreateAchievementDto } from './dto/create-achievement.dto'
import { UpdateAchievementDto } from './dto/update-achievement.dto'

@Controller('')
export class AchievementController {
  constructor(private readonly achievementService: AchievementService) {}

  @Post('fairs/:fairId/achievements')
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: CreateAchievementDto,
  ) {
    const user = req.user!
    return this.achievementService.create(fairId, user.id, dto)
  }

  @Get('fairs/:fairId/achievements')
  findByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.achievementService.findByFair(fairId, user)
  }

  @Patch('achievements/:id')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateAchievementDto,
  ) {
    const user = req.user!
    return this.achievementService.update(id, user.id, dto)
  }
}
