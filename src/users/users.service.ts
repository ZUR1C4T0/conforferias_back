import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { Prisma, UserRole } from '@prisma/client'
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
    if (existingUser) throw new ConflictException('Correo ya registrado')
    const hashedPassword = await bcrypt.hash(data.password, 10)
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role || UserRole.REPRESENTANTE,
      },
      omit: {
        password: true,
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
      omit: {
        password: true,
      },
    })
    if (!user) throw new NotFoundException()
    return user
  }

  async findAll(filters: { role?: UserRole }) {
    const { role } = filters
    return await this.prisma.user.findMany({
      where: {
        role: role || Prisma.skip,
      },
      omit: {
        password: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  async findRepresentatives() {
    return await this.prisma.user.findMany({
      where: {
        role: UserRole.REPRESENTANTE,
      },
      omit: {
        password: true,
      },
      orderBy: { name: 'asc' },
    })
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true },
    })
    if (!user) throw new NotFoundException()
    if (dto.email && dto.email !== user.email) {
      const existing = await this.prisma.user.findUnique({
        where: { email: dto.email },
        select: { id: true },
      })
      if (existing) throw new ConflictException('Correo ya registrado')
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
      },
      omit: {
        password: true,
      },
    })
  }

  async resetPassword(id: string, dto: ResetPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true },
    })
    if (!user) throw new NotFoundException()
    const hashed = await bcrypt.hash(dto.password, 10)
    return await this.prisma.user.update({
      where: { id },
      data: { password: hashed },
      omit: { password: true },
    })
  }
}
