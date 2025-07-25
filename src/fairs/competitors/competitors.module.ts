import { Module } from '@nestjs/common'
import { CompetitorsController } from './competitors.controller'
import { CompetitorsService } from './competitors.service'

@Module({
  imports: [],
  controllers: [CompetitorsController],
  providers: [CompetitorsService],
})
export class CompetitorsModule {}
