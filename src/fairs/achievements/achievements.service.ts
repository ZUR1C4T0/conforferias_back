import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '@/database/prisma.service'
import { CreateAchievementDto } from './dto/create-achievement.dto'
import { UpdateAchievementDto } from './dto/update-achievement.dto'

@Injectable()
export class AchievementsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateAchievementDto) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return await this.prisma.fairAchievement.create({
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
      return this.prisma.fairAchievement.findMany({
        where: {
          fairId,
          representativeId: rep.id,
        },
        orderBy: { id: 'asc' },
      })
    }
    return this.prisma.fairAchievement.findMany({
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
    id: string,
    userId: string,
    dto: UpdateAchievementDto,
  ) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const achievement = await this.prisma.fairAchievement.findUnique({
      where: { id },
      select: { representativeId: true },
    })
    if (!achievement) throw new NotFoundException()
    if (achievement.representativeId !== rep.id) {
      throw new ForbiddenException('No puedes editar este logro')
    }
    return this.prisma.fairAchievement.update({
      where: { id },
      data: dto,
    })
  }
}
