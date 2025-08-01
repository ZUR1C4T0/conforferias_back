import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy } from 'passport-local'
import { AuthService } from '../auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' })
  }

  async validate(email: string, password: string): Promise<Express.User> {
    const user = await this.authService.validateUser(email, password)
    return {
      id: user.id,
      role: user.role,
      token: '', // Token will be set during login
    }
  }
}
