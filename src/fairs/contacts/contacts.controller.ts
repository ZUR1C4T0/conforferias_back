import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '@/auth/decorators/roles.decorator'
import { ContactsService } from './contacts.service'
import { CreateContactDto } from './dto/create-contact.dto'
import { UpdateContactDto } from './dto/update-contact.dto'

@Controller('fairs/:fairId/contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() createContactDto: CreateContactDto,
  ) {
    const user = req.user!
    return this.contactsService.create(fairId, user.id, createContactDto)
  }

  @Get()
  findAllByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.contactsService.findAllByFair(fairId, user)
  }

  @Get(':contactId')
  findOne(
    @Param('fairId') fairId: string,
    @Param('contactId') contactId: string,
    @Req() req: Request,
  ) {
    const user = req.user!
    return this.contactsService.findOne(fairId, contactId, user.id)
  }

  @Patch(':contactId')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('fairId') fairId: string,
    @Param('contactId') contactId: string,
    @Req() req: Request,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    const user = req.user!
    return this.contactsService.update(
      fairId,
      contactId,
      user.id,
      updateContactDto,
    )
  }
}
