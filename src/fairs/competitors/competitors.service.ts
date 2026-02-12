import { UserRole } from '@generated/prisma/client'
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { CreateCompetitorDto } from './dto/create-competitor.dto'
import { UpdateCompetitorDto } from './dto/update-competitor.dto'

@Injectable()
export class CompetitorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateCompetitorDto) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
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

  async findAll(fairId: string, user: Express.User) {
    const fair = await this.prisma.fair.findUnique({
      where: { id: fairId },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException('Feria no encontrada')
    if (user.role === UserRole.REPRESENTANTE) {
      const rep = await this.prisma.fairRepresentative.findUnique({
        where: { fairId_userId: { fairId, userId: user.id } },
        select: { id: true },
      })
      if (!rep) throw new ForbiddenException()
    }
    return this.prisma.fairCompetitor.findMany({
      where: { fairId: fair.id },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(fairId: string, competitorId: string, user: Express.User) {
    const fair = await this.prisma.fair.findUnique({
      where: { id: fairId },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException('Feria no encontrada')
    if (user.role === UserRole.REPRESENTANTE) {
      const rep = await this.prisma.fairRepresentative.findUnique({
        where: { fairId_userId: { fairId, userId: user.id } },
        select: { id: true },
      })
      if (!rep) throw new ForbiddenException()
    }
    const competitor = await this.prisma.fairCompetitor.findUnique({
      where: { id: competitorId },
    })
    if (!competitor) throw new NotFoundException('Competidor no encontrado')
    return competitor
  }

  async update(
    fairId: string,
    competitorId: string,
    userId: string,
    dto: UpdateCompetitorDto,
  ) {
    const fair = await this.prisma.fair.findUnique({
      where: { id: fairId },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException('Feria no encontrada')
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const competitor = await this.prisma.fairCompetitor.findUnique({
      where: { id: competitorId },
      select: { fairId: true },
    })
    if (!competitor) throw new NotFoundException('Competidor no encontrado')
    return this.prisma.fairCompetitor.update({
      where: { id: competitorId },
      data: dto,
    })
  }
}
