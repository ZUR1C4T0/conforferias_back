import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { EvaluateFairDto } from './dto/evaluate-fair.dto'

@Injectable()
export class EvaluationsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(fairId: string, userId: string, dto: EvaluateFairDto) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
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
      create: {
        fairId,
        representativeId: rep.id,
        ...dto,
      },
      update: {
        ...dto,
      },
    })
  }

  async findOwnEvaluation(fairId: string, userId: string) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const evaluation = await this.prisma.fairEvaluation.findUnique({
      where: {
        fairId_representativeId: {
          fairId,
          representativeId: rep.id,
        },
      },
    })
    if (!evaluation) throw new NotFoundException('No existe una evaluación aún')
    return evaluation
  }

  async findAllByFair(fairId: string) {
    return await this.prisma.fairEvaluation.findMany({
      where: { fairId },
      include: {
        representative: {
          select: {
            id: true,
            fullName: true,
            user: {
              omit: { password: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
}
