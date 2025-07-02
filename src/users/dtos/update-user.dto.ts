import { User, UserRole } from '@prisma/client'
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator'

export class UpdateUserDto
  implements Partial<Omit<User, 'id' | 'password' | 'createdAt' | 'updatedAt'>>
{
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string

  @IsOptional()
  @IsEmail()
  email?: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole

  @IsOptional()
  @IsUUID()
  positionId?: string
}
