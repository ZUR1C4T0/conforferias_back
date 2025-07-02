import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { CreatePostFairActionDto } from './dto/create-post-fair-action.dto'
import { UpdatePostFairActionDto } from './dto/update-post-fair-action.dto'
import { PostFairActionsService } from './post-fair-actions.service'

@Controller('')
export class PostFairActionsController {
  constructor(
    private readonly postFairActionsService: PostFairActionsService,
  ) {}

  @Post('fairs/:fairId/post-fair-actions')
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() dto: CreatePostFairActionDto,
  ) {
    const user = req.user!
    return this.postFairActionsService.create(fairId, user.id, dto)
  }

  @Get('fairs/:fairId/post-fair-actions')
  findByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.postFairActionsService.findByFair(fairId, user)
  }

  @Patch('post-fair-actions/:id')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() dto: UpdatePostFairActionDto,
  ) {
    const user = req.user!
    return this.postFairActionsService.update(id, user.id, dto)
  }
}
