import { Module } from '@nestjs/common'
import { ImprovementAreasController } from './improvement-areas.controller';
import { ImprovementAreasService } from './improvement-areas.service';

@Module({
  imports: [],
  controllers: [ImprovementAreasController],
  providers: [ImprovementAreasService],
})
export class ImprovementAreasModule {}
