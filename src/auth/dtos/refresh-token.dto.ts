import { IsUUID } from 'class-validator'

export class RefreshTokenDto {
  @IsUUID()
  refreshToken: string
}
