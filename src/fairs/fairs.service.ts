import { Injectable, NotFoundException } from '@nestjs/common'
import { UserRole } from '@prisma/client'
import { StorageService } from '@/storage/storage.service'
import { PrismaService } from '../database/prisma.service'
import { CreateFairDto } from './dto/create-fair.dto'
import { UpdateFairDto } from './dto/update-fair.dto'

@Injectable()
export class FairsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: StorageService,
  ) {}

  async create(createFairDto: CreateFairDto) {
    return await this.prisma.fair.create({
      data: {
        ...createFairDto,
        logoUrl: '',
      },
    })
  }

  async upsertLogo(fairId: string, file: Express.Multer.File) {
    const fair = await this.prisma.fair.findUnique({
      where: { id: fairId },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException('Feria no encontrada')
    const logoUrl = await this.storageService.uploadFile(file)
    return this.prisma.fair.update({
      where: { id: fair.id },
      data: { logoUrl },
      select: { logoUrl: true },
    })
  }

  async findAll(user: Express.User) {
    const isReprUser = user.role === UserRole.REPRESENTANTE
    const whereCondition = isReprUser
      ? { representatives: { some: { userId: user.id } } }
      : {}
    return await this.prisma.fair.findMany({
      where: { ...whereCondition },
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
      throw new NotFoundException('Feria no encontrada')
    }
    return fair
  }

  async update(id: string, updateFairDto: UpdateFairDto) {
    const fair = await this.prisma.fair.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!fair) throw new NotFoundException('Feria no encontrada')
    return this.prisma.fair.update({
      where: { id },
      data: updateFairDto,
    })
  }
}
