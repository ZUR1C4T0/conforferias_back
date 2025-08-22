import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AuthModule } from './auth/auth.module'
import { DatabaseModule } from './database/database.module'
import { FairsModule } from './fairs/fairs.module'
import { KeepAliveController } from './keep-alive.controller'
import { StorageModule } from './storage/storage.module'
import { UsersModule } from './users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    ScheduleModule.forRoot(),
    UsersModule,
    FairsModule,
    StorageModule,
  ],
  controllers: [KeepAliveController],
  providers: [],
})
export class AppModule {}
