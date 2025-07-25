import { Module } from '@nestjs/common'
import { ContactsController } from './contacts.controller'
import { ContactsService } from './contacts.service'
import { ProfilesController } from './profiles.controller'
import { ProfilesService } from './profiles.service'

@Module({
  imports: [],
  controllers: [ContactsController, ProfilesController],
  providers: [ContactsService, ProfilesService],
})
export class ContactsModule {}
