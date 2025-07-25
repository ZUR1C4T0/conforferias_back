import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, UserRole } from '@prisma/client'
import { PrismaService } from '@/database/prisma.service'
import { CreateContactDto } from './dto/create-contact.dto'
import { UpdateContactDto } from './dto/update-contact.dto'

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, contact: CreateContactDto) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: {
        fairId_userId: { fairId, userId },
      },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.contact.create({
      data: {
        ...contact,
        fairId,
        createdById: rep.id,
      },
    })
  }

  async findAllByFair(fairId: string, user: Express.User) {
    const isReprUser = user.role === UserRole.REPRESENTANTE
    let rep: { id: string } | null = null
    if (isReprUser) {
      rep = await this.prisma.fairRepresentative.findUnique({
        where: { fairId_userId: { fairId, userId: user.id } },
        select: { id: true },
      })
    }
    if (isReprUser && !rep) throw new ForbiddenException()
    return this.prisma.contact.findMany({
      where: {
        fairId,
        createdById: rep?.id ?? Prisma.skip,
      },
      select: {
        id: true,
        name: true,
        company: true,
        profile: { select: { id: true, name: true } },
        otherProfile: true,
        estimatedPotential: true,
        createdBy: { select: { id: true, fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(fairId: string, contactId: string, userId: string) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const contact = await this.prisma.contact.findUnique({
      where: { id: contactId },
      include: { profile: true, sale: true },
    })
    if (!contact || contact.createdById !== rep.id) {
      throw new NotFoundException('Contacto no encontrado')
    }
    return contact
  }

  async update(
    fairId: string,
    contactId: string,
    userId: string,
    dto: UpdateContactDto,
  ) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const contact = await this.prisma.contact.findUnique({
      where: { id: contactId },
      select: { createdById: true },
    })
    if (!contact || contact.createdById !== rep.id) {
      throw new NotFoundException('Contacto no encontrado')
    }
    return this.prisma.contact.update({
      where: { id: contactId },
      data: dto,
    })
  }
}
