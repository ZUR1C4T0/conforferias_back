import { Controller, Get } from '@nestjs/common'
import { ProfilesService } from './profiles.service'

@Controller('contact-profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  findAll() {
    return this.profilesService.findAll()
  }
}
