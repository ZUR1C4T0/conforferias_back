import { User, UserRole } from '@prisma/client'
import {
  IsEmail,
  IsEnum,
  IsString,
  IsStrongPassword,
  IsUUID,
  MinLength,
} from 'class-validator'

export class CreateUserDto
  implements Omit<User, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @MinLength(3)
  readonly name: string

  @IsEmail()
  readonly email: string

  @IsString()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
  })
  readonly password: string

  @IsEnum(UserRole)
  readonly role: UserRole

  @IsUUID()
  readonly positionId: string
}
