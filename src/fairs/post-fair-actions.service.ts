import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CreatePostFairActionDto } from './dto/create-post-fair-action.dto'
import { UpdatePostFairActionDto } from './dto/update-post-fair-action.dto'

@Injectable()
export class PostFairActionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreatePostFairActionDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { fairId, userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.postFairAction.create({
      data: {
        fairId,
        action: dto.action,
        limitDate: dto.limitDate,
        status: dto.status ?? undefined,
        responsibleId: rep.id,
      },
    })
  }

  async findByFair(fairId: string, user: Express.User) {
    if (user.role === UserRole.REPRESENTANTE) {
      const isRep = await this.prisma.fairRepresentative.findFirst({
        where: { fairId, userId: user.id },
        select: { id: true },
      })
      if (!isRep) throw new ForbiddenException()
      return this.prisma.postFairAction.findMany({
        where: { fairId, responsibleId: isRep.id },
        include: {
          responsible: {
            select: { id: true, fullName: true },
          },
        },
        orderBy: { limitDate: 'asc' },
      })
    }
    return this.prisma.postFairAction.findMany({
      where: { fairId },
      include: {
        responsible: {
          select: { id: true, fullName: true },
        },
      },
      orderBy: { limitDate: 'asc' },
    })
  }

  async update(id: string, userId: string, dto: UpdatePostFairActionDto) {
    const rep = await this.prisma.fairRepresentative.findFirst({
      where: { userId },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const action = await this.prisma.postFairAction.findUnique({
      where: { id },
      select: { responsibleId: true },
    })
    if (!action) throw new NotFoundException()
    if (action.responsibleId !== rep.id) throw new ForbiddenException()
    return this.prisma.postFairAction.update({
      where: { id },
      data: dto,
    })
  }
}
