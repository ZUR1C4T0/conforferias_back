import { Module } from '@nestjs/common'
import { DafoController } from './dafo.controller';
import { DafoService } from './dafo.service';

@Module({
  imports: [],
  controllers: [DafoController],
  providers: [DafoService],
})
export class DafoModule {}
