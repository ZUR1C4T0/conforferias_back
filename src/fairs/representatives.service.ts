import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { AssignRepresentativesDto } from './dto/assign-representatives.dto'

@Injectable()
export class RepresentativesService {
  constructor(private readonly prisma: PrismaService) {}

  async assignRepresentatives(fairId: string, dto: AssignRepresentativesDto) {
    const fairExists = this.prisma.fair.findUnique({
      where: { id: fairId },
      select: { id: true },
    })
    if (!fairExists) throw new NotFoundException('Fair not found')
    await this.prisma.fairRepresentative.deleteMany({ where: { fairId } })
    const uniqueReps = Array.from(
      new Map(dto.representatives.map((rep) => [rep.userId, rep])).values(),
    )
    const representatives = await this.prisma.user.findMany({
      where: { id: { in: uniqueReps.map((r) => r.userId) } },
      select: { id: true, name: true, position: true },
    })
    const data = representatives.map((rep) => ({
      fairId,
      userId: rep.id,
      fullName: rep.name,
    }))
    await this.prisma.fairRepresentative.createMany({ data })
  }

  async getRepresentatives(fairId: string) {
    const fairExists =
      (await this.prisma.fair.count({ where: { id: fairId } })) > 0
    if (!fairExists) {
      throw new NotFoundException('Fair not found')
    }
    return await this.prisma.fairRepresentative.findMany({
      where: { fairId },
      select: {
        id: true,
        fullName: true,
        user: {
          select: {
            id: true,
            name: true,
            position: true,
            email: true,
          },
        },
      },
      orderBy: { fullName: 'asc' },
    })
  }
}
