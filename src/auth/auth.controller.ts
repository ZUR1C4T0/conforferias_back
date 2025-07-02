import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import type { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { RefreshTokenDto } from './dtos/refresh-token.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request) {
    const user = req.user!
    return await this.authService.login(user)
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: RefreshTokenDto) {
    const refreshToken = body.refreshToken
    return await this.authService.refreshAccessToken(refreshToken)
  }

  @Delete('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request) {
    const token = req.user?.token!
    if (token) await this.authService.logout(token)
    return
  }

  @Delete('logout/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logoutAll(@Req() req: Request) {
    const user = req.user!
    await this.authService.logoutAll(user.id)
    return
  }
}
