import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CreateTrendDto } from './dto/create-trend.dto'
import { UpdateTrendDto } from './dto/update-trend.dto'

@Injectable()
export class TrendsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateTrendDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.trend.create({
      data: { fairId, ...dto },
    })
  }

  async findByFair(fairId: string, user: Express.User) {
    if (user.role === UserRole.REPRESENTANTE) {
      const isRep = await this.prisma.fairRepresentative.findFirst({
        where: { fairId, userId: user.id },
        select: { id: true },
      })
      if (!isRep) throw new ForbiddenException()
    }
    return this.prisma.trend.findMany({
      where: { fairId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async update(id: string, userId: string, dto: UpdateTrendDto) {
    const trend = await this.prisma.trend.findUnique({
      where: { id },
      select: { fairId: true },
    })
    if (!trend) throw new NotFoundException()
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { userId, fairId: trend.fairId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.trend.update({
      where: { id },
      data: dto,
    })
  }
}
