import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { CreateRecommendationDto } from './dto/create-recommendation.dto'
import { UpdateRecommendationDto } from './dto/update-recommendation.dto'
import { RecommendationsService } from './recommendations.service'

@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post('fairs/:fairId/recommendations')
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: CreateRecommendationDto,
  ) {
    const user = req.user!
    return this.recommendationsService.create(fairId, user.id, dto)
  }

  @Get('fairs/:fairId/recommendations')
  findByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.recommendationsService.findByFair(fairId, user)
  }

  @Patch('recommendations/:id')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdateRecommendationDto,
  ) {
    const user = req.user!
    return this.recommendationsService.update(id, user.id, dto)
  }
}
