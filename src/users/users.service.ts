import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { UserRole } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../database/prisma.service'
import { CreateUserDto } from './dtos/create-user.dto'
import { ResetPasswordDto } from './dtos/reset-password.dto'
import { UpdateUserDto } from './dtos/update-user.dto'

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: { id: true },
    })
    if (existingUser) throw new ConflictException('Email already in use')

    const position = await this.prisma.position.findUnique({
      where: { id: data.positionId },
      select: { id: true },
    })
    if (!position) throw new NotFoundException('Position not found')

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || UserRole.REPRESENTANTE,
        positionId: data.positionId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: { select: { id: true, name: true } },
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        role: true,
        password: true, // Include password for authentication
      },
    })
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    if (!user) throw new NotFoundException('User not found')
    return user
  }

  async findAll(filters: { role?: UserRole; positionId?: string }) {
    const { role, positionId } = filters
    return await this.prisma.user.findMany({
      where: {
        ...(role && { role }),
        ...(positionId && { positionId }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: {
          select: {
            id: true,
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findRepresentatives() {
    return await this.prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.MERCADEO, UserRole.REPRESENTANTE],
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        position: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    })
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    })
    if (!user) throw new NotFoundException('User not found')

    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      })
      if (existing) throw new ConflictException('Email already in use')
    }

    if (dto.positionId) {
      const position = await this.prisma.position.findUnique({
        where: { id: dto.positionId },
        select: { id: true },
      })
      if (!position) throw new NotFoundException('Position not found')
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        position: {
          select: { id: true, name: true },
        },
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  async resetPassword(id: string, dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!user) throw new NotFoundException('User not found')

    const hashed = await bcrypt.hash(dto.newPassword, 10)

    await this.prisma.user.update({
      where: { id },
      data: { password: hashed },
      select: { id: true },
    })

    return { message: 'Password updated successfully' }
  }
}
