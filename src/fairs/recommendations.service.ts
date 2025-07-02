import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CreateRecommendationDto } from './dto/create-recommendation.dto'
import { UpdateRecommendationDto } from './dto/update-recommendation.dto'

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateRecommendationDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.fairRecommendation.create({
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
      return this.prisma.fairRecommendation.findMany({
        where: {
          fairId,
          representativeId: rep.id,
        },
        orderBy: { createdAt: 'desc' },
      })
    }
    return this.prisma.fairRecommendation.findMany({
      where: { fairId },
      include: {
        representative: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async update(id: string, userId: string, dto: UpdateRecommendationDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const recommendation = await this.prisma.fairRecommendation.findUnique({
      where: { id },
      select: { representativeId: true },
    })
    if (!recommendation) throw new NotFoundException()
    if (recommendation.representativeId !== rep.id) {
      throw new ForbiddenException()
    }
    return this.prisma.fairRecommendation.update({
      where: { id },
      data: dto,
    })
  }
}
