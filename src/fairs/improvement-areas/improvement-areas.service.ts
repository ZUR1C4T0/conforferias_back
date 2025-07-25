import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '@/database/prisma.service'
import { CreateImprovementAreaDto } from './dto/create-improvement-area.dto'
import { UpdateImprovementAreaDto } from './dto/update-improvement-area.dto'

@Injectable()
export class ImprovementAreasService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateImprovementAreaDto) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
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
      const rep = await this.prisma.fairRepresentative.findUnique({
        where: { fairId_userId: { fairId, userId: user.id } },
        select: { id: true },
      })
      if (!rep) throw new ForbiddenException()
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

  async update(
    fairId: string,
    improvementAreaId: string,
    userId: string,
    dto: UpdateImprovementAreaDto,
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
    const improvementArea = await this.prisma.improvementArea.findUnique({
      where: { id: improvementAreaId },
      select: { fairId: true },
    })
    if (!improvementArea)
      throw new NotFoundException('Area de mejora no encontrada')
    return this.prisma.improvementArea.update({
      where: { id: improvementAreaId },
      data: dto,
    })
  }
}
