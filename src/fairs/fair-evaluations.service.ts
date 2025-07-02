import { ForbiddenException, Injectable } from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { EvaluateFairDto } from './dto/evaluate-fair.dto'

@Injectable()
export class FairEvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(fairId: string, userId: string, dto: EvaluateFairDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.fairEvaluation.upsert({
      where: {
        fairId_representativeId: {
          fairId,
          representativeId: rep.id,
        },
      },
      update: {
        score: dto.score,
        explanation: dto.explanation,
      },
      create: {
        fairId,
        representativeId: rep.id,
        score: dto.score,
        explanation: dto.explanation,
      },
    })
  }

  async findOwnEvaluation(fairId: string, userId: string) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.fairEvaluation.findUnique({
      where: {
        fairId_representativeId: {
          fairId,
          representativeId: rep.id,
        },
      },
    })
  }

  async findAllByFair(fairId: string) {
    return await this.prisma.fairEvaluation.findMany({
      where: { fairId },
      include: {
        representative: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}
