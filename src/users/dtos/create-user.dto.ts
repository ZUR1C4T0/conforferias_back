import { User, UserRole } from '@generated/prisma/client'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator'

export class CreateUserDto
  implements Omit<User, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @IsNotEmpty()
  readonly name: string

  @IsEmail()
  readonly email: string

  @IsString()
  @MinLength(6)
  readonly password: string

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  readonly role: UserRole
}
