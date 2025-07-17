import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CreateContactDto } from './dto/create-contact.dto'
import { CreateContactNoteDto } from './dto/create-contact-note.dto'
import { UpdateContactDto } from './dto/update-contact.dto'

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, contact: CreateContactDto) {
    const isRepresentative = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!isRepresentative) throw new ForbiddenException()
    return await this.prisma.contact.create({
      data: {
        ...contact,
        fairId,
        createdById: isRepresentative.id,
      },
    })
  }

  async createNote(
    contactId: string,
    userId: string,
    dto: CreateContactNoteDto,
  ) {
    const representative = await this.prisma.fairRepresentative.findFirst({
      where: { userId },
      select: { id: true },
    })
    if (!representative) throw new ForbiddenException()
    const contact = await this.prisma.contact.findUnique({
      where: { id: contactId },
      select: { createdById: true },
    })
    if (!contact) throw new NotFoundException()
    if (contact.createdById !== representative.id) {
      throw new ForbiddenException()
    }
    return this.prisma.contactTrackingNote.create({
      data: { contactId, note: dto.note },
    })
  }

  async findAllByFair(fairId: string, user: Express.User) {
    if (user.role === UserRole.REPRESENTANTE) {
      const isRep = await this.prisma.fairRepresentative.findFirst({
        where: { fairId, userId: user.id },
        select: { id: true },
      })
      if (!isRep) throw new ForbiddenException()
      return this.prisma.contact.findMany({
        where: { fairId, createdById: isRep.id },
        select: {
          id: true,
          name: true,
          company: true,
          profile: { select: { name: true } },
          otherProfile: true,
          estimatedPotential: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    }
    const contacts = await this.prisma.contact.findMany({
      where: { fairId },
      select: {
        id: true,
        name: true,
        company: true,
        profile: { select: { name: true } },
        otherProfile: true,
        estimatedPotential: true,
        createdBy: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    const contactsByRep = contacts.reduce((acc, contact) => {
      const { createdBy, ...contactData } = contact
      const repId = createdBy.id
      if (!acc[repId]) {
        acc[repId] = {
          representative: {
            id: repId,
            fullName: createdBy.fullName,
          },
          contacts: [],
        }
      }
      acc[repId].contacts.push(contactData)
      return acc
    }, {})
    return Object.values(contactsByRep)
  }

  async findOne(contactId: string, userId: string) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const contact = await this.prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        profile: true,
        tracking: { orderBy: { createdAt: 'desc' } },
      },
    })
    if (!contact) throw new NotFoundException()
    if (contact.createdById !== rep.id) {
      throw new ForbiddenException()
    }
    return contact
  }

  async findContactProfiles() {
    return await this.prisma.contactProfile.findMany({
      select: { id: true, name: true, description: true },
    })
  }

  async update(contactId: string, userId: string, dto: UpdateContactDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const contact = await this.prisma.contact.findUnique({
      where: { id: contactId },
      select: { createdById: true },
    })
    if (!contact) throw new NotFoundException()
    if (contact.createdById !== rep.id) throw new ForbiddenException()
    return this.prisma.contact.update({
      where: { id: contactId },
      data: dto,
    })
  }
}
