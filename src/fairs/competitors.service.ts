import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CreateCompetitorDto } from './dto/create-competitor.dto'
import { UpdateCompetitorDto } from './dto/update-competitor.dto'

@Injectable()
export class CompetitorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateCompetitorDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.fairCompetitor.create({
      data: {
        fairId,
        representativeId: rep.id,
        ...dto,
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
    }
    return await this.prisma.fairCompetitor.findMany({
      where: { fairId },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async findOne(id: string) {
    return await this.prisma.fairCompetitor.findUnique({
      where: { id },
      select: { fairId: true },
    })
  }

  async update(id: string, userId: string, dto: UpdateCompetitorDto) {
    const competitor = await this.prisma.fairCompetitor.findUnique({
      where: { id },
      select: { fairId: true },
    })
    if (!competitor) throw new NotFoundException()
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId: competitor.fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.fairCompetitor.update({
      where: { id },
      data: dto,
    })
  }
}
