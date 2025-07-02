import { randomUUID } from 'node:crypto'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../database/prisma.service'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email)
    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return { id: user.id, role: user.role }
  }

  async login(user: Express.User) {
    const accessPayload: JwtPayload = { sub: user.id, role: user.role }
    const accessToken = this.jwtService.sign(accessPayload)
    const refreshToken = randomUUID()
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 5) // 5 days
    await this.prisma.session.create({
      data: {
        userId: user.id,
        token: accessToken,
        refreshToken,
        expiresAt,
      },
      select: { id: true },
    })
    return {
      accessToken,
      refreshToken,
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      select: {
        userId: true,
        expiresAt: true,
        user: { select: { role: true } },
      },
    })
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalid or expired')
    }
    const payload: JwtPayload = {
      sub: session.userId,
      role: session.user.role,
    }
    const newAccessToken = this.jwtService.sign(payload)
    await this.prisma.session.update({
      where: { refreshToken },
      data: { token: newAccessToken },
    })
    return { accessToken: newAccessToken }
  }

  async logout(token: string) {
    await this.prisma.session.deleteMany({ where: { token } })
  }

  async logoutAll(userId: string) {
    await this.prisma.session.deleteMany({
      where: { userId },
    })
  }
}
