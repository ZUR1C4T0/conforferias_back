import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CreateImprovementAreaDto } from './dto/create-improvement-area.dto'
import { UpdateImprovementAreaDto } from './dto/update-improvement-area.dto'

@Injectable()
export class ImprovementAreasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateImprovementAreaDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.improvementArea.create({
      data: {
        fairId,
        representativeId: rep.id,
        content: dto.content,
      },
    })
  }

  async findByFair(fairId: string, user: Express.User) {
    if (user.role === UserRole.REPRESENTANTE) {
      const rep = await this.prisma.fairRepresentative.findFirst({
        where: { fairId, userId: user.id },
        select: { id: true },
      })
      if (!rep) throw new ForbiddenException()
      return this.prisma.improvementArea.findMany({
        where: {
          fairId,
          representativeId: rep.id,
        },
        orderBy: { createdAt: 'desc' },
      })
    }
    return this.prisma.improvementArea.findMany({
      where: { fairId },
      include: {
        representative: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async update(id: string, userId: string, dto: UpdateImprovementAreaDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const record = await this.prisma.improvementArea.findUnique({
      where: { id },
      select: { representativeId: true },
    })
    if (!record) throw new NotFoundException()
    if (record.representativeId !== rep.id) {
      throw new ForbiddenException()
    }
    return this.prisma.improvementArea.update({
      where: { id },
      data: dto,
    })
  }
}
