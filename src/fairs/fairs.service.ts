import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { PrismaService } from '../database/prisma.service'
import { CreateFairDto } from './dto/create-fair.dto'
import { UpdateFairDto } from './dto/update-fair.dto'

@Injectable()
export class FairsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateFairDto & { logoUrl: string }) {
    return await this.prisma.fair.create({
      data,
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        country: true,
        city: true,
        standNumber: true,
        logoUrl: true,
        areaM2: true,
        totalInvestment: true,
      },
    })
  }

  async findAll(user: Express.User) {
    if (user.role === UserRole.ADMIN || user.role === UserRole.MERCADEO) {
      return await this.prisma.fair.findMany({
        select: {
          id: true,
          name: true,
          logoUrl: true,
        },
        orderBy: { createdAt: 'desc' },
      })
    }

    return await this.prisma.fair.findMany({
      where: {
        representatives: {
          some: { userId: user.id },
        },
      },
      select: {
        id: true,
        name: true,
        logoUrl: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findOne(id: string, user: Express.User) {
    const fairWithRepresentatives = await this.prisma.fair.findUnique({
      where: { id },
      include: {
        representatives: {
          select: { userId: true },
        },
      },
    })

    if (!fairWithRepresentatives) throw new NotFoundException()
    const { representatives, ...fair } = fairWithRepresentatives

    if (
      user.role === UserRole.REPRESENTANTE &&
      !representatives.some((r) => r.userId === user.id)
    ) {
      throw new ForbiddenException()
    }

    return fair
  }

  update(id: string, updateFairDto: UpdateFairDto) {
    const fair = this.prisma.fair.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException()
    return this.prisma.fair.update({
      where: { id },
      data: updateFairDto,
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        country: true,
        city: true,
        standNumber: true,
        logoUrl: true,
        areaM2: true,
        totalInvestment: true,
      },
    })
  }

  async updateLogo(id: string, logoUrl: string) {
    const fair = await this.prisma.fair.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException()
    return await this.prisma.fair.update({
      where: { id },
      data: { logoUrl },
      select: {
        id: true,
        name: true,
        startDate: true,
        endDate: true,
        country: true,
        city: true,
        standNumber: true,
        logoUrl: true,
        areaM2: true,
        totalInvestment: true,
      },
    })
  }
}
