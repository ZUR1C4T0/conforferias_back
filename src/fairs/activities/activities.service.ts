import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { CreateActivityDto } from './dto/create-activity.dto'
import { UpdateActivityDto } from './dto/update-activity.dto'

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, dto: CreateActivityDto) {
    return await this.prisma.parallelActivity.create({
      data: { fairId, ...dto },
    })
  }

  async findAll(fairId: string) {
    return await this.prisma.parallelActivity.findMany({
      where: { fairId },
      orderBy: { createdAt: 'desc' },
    })
  }

  async update(fairId: string, activityId: string, dto: UpdateActivityDto) {
    const fair = await this.prisma.fair.findUnique({
      where: { id: fairId },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException('Feria no encontrada')
    const activity = await this.prisma.parallelActivity.findUnique({
      where: { id: activityId },
      select: { id: true },
    })
    if (!activity) {
      throw new NotFoundException('Actividad paralela no encontrada')
    }
    return this.prisma.parallelActivity.update({
      where: { id: activityId },
      data: dto,
    })
  }
}
