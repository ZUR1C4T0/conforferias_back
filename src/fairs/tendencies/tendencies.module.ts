import { Module } from '@nestjs/common'
import { TendenciesController } from './tendencies.controller'
import { TendenciesService } from './tendencies.service'

@Module({
  imports: [],
  controllers: [TendenciesController],
  providers: [TendenciesService],
})
export class TendenciesModule {}
