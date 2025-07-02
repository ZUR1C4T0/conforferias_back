import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import type { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../database/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret',
      passReqToCallback: true, // pass request to callback
    })
  }

  async validate(req: Request, _payload: JwtPayload): Promise<Express.User> {
    // Extract token from request
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req) ?? ''
    const session = await this.prisma.session.findUnique({
      where: { token },
      select: {
        userId: true,
        expiresAt: true,
        user: {
          select: {
            role: true,
          },
        },
      },
    })
    if (!session || session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired or invalid')
    }
    return {
      id: session.userId,
      role: session.user.role,
      token
    }
  }
}
