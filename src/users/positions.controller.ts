import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../auth/decorators/roles.decorator'
import { CreatePositionDto } from './dtos/create-position.dto'
import { UpdatePositionDto } from './dtos/update-position.dto'
import { PositionsService } from './positions.service'

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsService: PositionsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createPositionDto: CreatePositionDto) {
    return this.positionsService.create(createPositionDto)
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  findAll() {
    return this.positionsService.findAll()
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.positionsService.findOne(id)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(
    @Param('id') id: string,
    @Body() updatePositionDto: UpdatePositionDto,
  ) {
    return this.positionsService.update(id, updatePositionDto)
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  delete(@Param('id') id: string) {
    return this.positionsService.delete(id)
  }
}
