import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '@/database/prisma.service'
import { CreateTendencyDto } from './dto/create-tendency.dto'
import { UpdateTendencyDto } from './dto/update-tendency.dto'

@Injectable()
export class TendenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateTendencyDto) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.tendency.create({
      data: { fairId, ...dto },
    })
  }

  async findByFair(fairId: string, userId: string) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.tendency.findMany({
      where: { fairId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async update(
    fairId: string,
    tendencyId: string,
    userId: string,
    dto: UpdateTendencyDto,
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
    const tendency = await this.prisma.tendency.findUnique({
      where: { id: tendencyId },
      select: { fairId: true },
    })
    if (!tendency) throw new NotFoundException('Tendencia no encontrada')
    return this.prisma.tendency.update({
      where: { id: tendencyId },
      data: dto,
    })
  }
}
