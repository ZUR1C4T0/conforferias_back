import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { Request } from 'express'
import { Roles } from '../auth/decorators/roles.decorator'
import { ContactsService } from './contacts.service'
import { CreateContactDto } from './dto/create-contact.dto'
import { CreateContactNoteDto } from './dto/create-contact-note.dto'
import { UpdateContactDto } from './dto/update-contact.dto'

@Controller('')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post('fairs/:fairId/contacts')
  @Roles(UserRole.REPRESENTANTE)
  create(
    @Param('fairId') fairId: string,
    @Req() req: Request,
    @Body() createContactDto: CreateContactDto,
  ) {
    const user = req.user!
    return this.contactsService.create(fairId, user.id, createContactDto)
  }

  @Post('contacts/:id/notes')
  @Roles(UserRole.REPRESENTANTE)
  createNote(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() createContactNoteDto: CreateContactNoteDto,
  ) {
    const user = req.user!
    return this.contactsService.createNote(id, user.id, createContactNoteDto)
  }

  @Get('fairs/:fairId/contacts')
  findAllByFair(@Param('fairId') fairId: string, @Req() req: Request) {
    const user = req.user!
    return this.contactsService.findAllByFair(fairId, user)
  }

  @Get('contacts/:id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    const user = req.user!
    return this.contactsService.findOne(id, user.id)
  }

  @Get('contact-profiles')
  findContactProfiles() {
    return this.contactsService.findContactProfiles()
  }

  @Patch('contacts/:id')
  @Roles(UserRole.REPRESENTANTE)
  update(
    @Param('id') id: string,
    @Req() req: Request,
    @Body() updateContactDto: UpdateContactDto,
  ) {
    const user = req.user!
    return this.contactsService.update(id, user.id, updateContactDto)
  }
}
