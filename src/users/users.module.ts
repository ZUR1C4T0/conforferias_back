import { Module } from '@nestjs/common'
import { PositionsController } from './positions.controller'
import { PositionsService } from './positions.service'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  controllers: [UsersController, PositionsController],
  providers: [UsersService, PositionsService],
  exports: [UsersService],
})
export class UsersModule {}
