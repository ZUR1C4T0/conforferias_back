import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CreateActivityDto } from './dto/create-activity.dto'
import { UpdateActivityDto } from './dto/update-activity.dto'

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateActivityDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.parallelActivity.create({
      data: {
        fairId,
        representativeId: rep.id,
        ...dto,
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
      return this.prisma.parallelActivity.findMany({
        where: { fairId, representativeId: rep.id },
        orderBy: { createdAt: 'asc' },
      })
    }
    const activities = await this.prisma.parallelActivity.findMany({
      where: { fairId },
      include: {
        representative: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })
    const grouped = activities.reduce((acc, activity) => {
      const { representative, ...activityData } = activity
      const repId = representative.id
      if (!acc[repId]) {
        acc[repId] = {
          representative,
          activities: [],
        }
      }
      acc[repId].activities.push(activityData)
      return acc
    }, {})
    return Object.values(grouped)
  }

  async update(id: string, userId: string, dto: UpdateActivityDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const activity = await this.prisma.parallelActivity.findUnique({
      where: { id },
      select: { representativeId: true },
    })
    if (!activity) throw new NotFoundException()
    if (activity.representativeId !== rep.id) {
      throw new ForbiddenException()
    }
    return this.prisma.parallelActivity.update({
      where: { id },
      data: dto,
    })
  }
}
