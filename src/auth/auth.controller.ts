import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth } from '@nestjs/swagger'
import type { Request } from 'express'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { LoginDto } from './dtos/login.dto'
import { RefreshTokenDto } from './dtos/refresh-token.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  async login(@Req() req: Request, @Body() _body: LoginDto) {
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
  @ApiBearerAuth()
  async logout(@Req() req: Request) {
    const token = req.user?.token!
    if (token) await this.authService.logout(token)
    return
  }

  @Delete('logout/all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  async logoutAll(@Req() req: Request) {
    const user = req.user!
    await this.authService.logoutAll(user.id)
    return
  }
}
