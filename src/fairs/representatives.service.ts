import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { AssignRepresentativesDto } from './dto/assign-representatives.dto'

@Injectable()
export class RepresentativesService {
  constructor(private readonly prisma: PrismaService) {}

  async assignRepresentatives(fairId: string, dto: AssignRepresentativesDto) {
    const fair = await this.prisma.fair.findUnique({
      where: { id: fairId },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException('Feria no encontrada')
    await this.prisma.fairRepresentative.deleteMany({ where: { fairId } })
    const uniqueReps = Array.from(
      new Set(dto.representatives.map((rep) => rep.userId)),
    )
    const representatives = await this.prisma.user.findMany({
      where: { id: { in: uniqueReps } },
      select: { id: true, name: true },
    })
    const data = representatives.map((rep) => ({
      fairId,
      userId: rep.id,
      fullName: rep.name,
    }))
    await this.prisma.fairRepresentative.createMany({ data })
  }

  async getRepresentatives(fairId: string) {
    const fair = await this.prisma.fair.findUnique({
      where: { id: fairId },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException('Feria no encontrada')
    return await this.prisma.fairRepresentative.findMany({
      where: { fairId },
      select: {
        id: true,
        fullName: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { fullName: 'asc' },
    })
  }
}
