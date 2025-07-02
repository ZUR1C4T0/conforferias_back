import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '../database/prisma.service'
import { CreatePositionDto } from './dtos/create-position.dto'
import { UpdatePositionDto } from './dtos/update-position.dto'

@Injectable()
export class PositionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePositionDto) {
    const existingPosition = await this.prisma.position.findUnique({
      where: { name: data.name },
      select: { id: true },
    })
    if (existingPosition) throw new ConflictException('Position already exists')

    return await this.prisma.position.create({
      data: {
        name: data.name,
        description: data.description || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findAll() {
    return await this.prisma.position.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: { users: true },
        },
      },
      orderBy: { name: 'asc' },
    })
  }

  async findOne(id: string) {
    const position = await this.prisma.position.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: { users: true },
        },
      },
    })
    if (!position) throw new NotFoundException('Position not found')
    return position
  }

  async update(id: string, updatePositionDto: UpdatePositionDto) {
    const position = await this.prisma.position.findUnique({
      where: { id },
      select: { id: true, name: true, description: true },
    })
    if (!position) throw new NotFoundException('Position not found')

    return await this.prisma.position.update({
      where: { id },
      data: {
        name: updatePositionDto.name || position.name,
        description: updatePositionDto.description || null,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async delete(id: string) {
    const position = await this.prisma.position.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!position) throw new NotFoundException('Position not found')

    const usersCount = await this.prisma.user.count({
      where: { positionId: id },
    })
    if (usersCount > 0) {
      throw new ConflictException(
        'Cannot delete position with associated users',
      )
    }
    return await this.prisma.position.delete({
      where: { id },
      select: {
        id: true,
        name: true,
      },
    })
  }
}
