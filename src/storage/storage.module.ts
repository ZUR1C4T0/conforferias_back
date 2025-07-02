import { Global, Module } from '@nestjs/common'
import { R2Service } from './r2.service'
import { StorageService } from './storage.service'

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [StorageService, R2Service],
  exports: [StorageService],
})
export class StorageModule {}
