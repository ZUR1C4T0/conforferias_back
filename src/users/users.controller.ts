import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Roles } from '../auth/decorators/roles.decorator'
import { CreateUserDto } from './dtos/create-user.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { UpdateUserDto } from './dtos/update-user.dto'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto)
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(
    @Query('role') role?: UserRole,
    @Query('positionId') positionId?: string,
  ) {
    return this.usersService.findAll({ role, positionId })
  }

  @Get('representatives')
  @Roles(UserRole.ADMIN, UserRole.MERCADEO)
  findRepresentatives() {
    return this.usersService.findRepresentatives()
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id)
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto)
  }

  @Patch(':id/password')
  @Roles(UserRole.ADMIN)
  resetPassword(@Param('id') id: string, @Body() dto: ResetPasswordDto) {
    return this.usersService.resetPassword(id, dto)
  }
}
