import { Body, Controller, Get, Param, Put } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../auth/decorators/roles.decorator'
import { AssignRepresentativesDto } from './dto/assign-representatives.dto'
import { RepresentativesService } from './representatives.service'

@Controller(':fairId/representatives')
export class RepresentativesController {
  constructor(
    private readonly representativesService: RepresentativesService,
  ) {}

  @Put()
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  assignRepresentatives(
    @Param('fairId') fairId: string,
    @Body() body: AssignRepresentativesDto,
  ) {
    return this.representativesService.assignRepresentatives(fairId, body)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  getRepresentatives(@Param('fairId') fairId: string) {
    return this.representativesService.getRepresentatives(fairId)
  }
}
