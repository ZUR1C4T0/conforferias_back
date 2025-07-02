import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CreateDafoDto } from './dto/create-dafo.dto'
import { UpdateDafoDto } from './dto/update-dafo.dto'

@Injectable()
export class DafoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateDafoDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.dafoAnalysis.create({
      data: {
        fairId,
        representativeId: rep.id,
        ...dto,
      },
    })
  }

  async findAll(fairId: string, user: Express.User) {
    if (user.role === UserRole.REPRESENTANTE) {
      const rep = await this.prisma.fairRepresentative.findFirst({
        where: { fairId, userId: user.id },
        select: { id: true },
      })
      if (!rep) throw new ForbiddenException()
      return this.prisma.dafoAnalysis.findMany({
        where: {
          fairId,
          representativeId: rep.id,
        },
        orderBy: { type: 'asc' },
      })
    }
    return this.prisma.dafoAnalysis.findMany({
      where: { fairId },
      orderBy: { type: 'asc' },
    })
  }

  async update(id: string, userId: string, dto: UpdateDafoDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { id, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const dafo = await this.prisma.dafoAnalysis.findUnique({
      where: { id },
      select: { representativeId: true },
    })
    if (!dafo) throw new NotFoundException()
    if (dafo.representativeId !== rep.id) throw new ForbiddenException()
    return this.prisma.dafoAnalysis.update({
      where: { id },
      data: dto,
    })
  }
}
