import { ApiProperty } from '@nestjs/swagger'
import { User, UserRole } from '@prisma/client'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
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
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
  })
  readonly password: string

  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  readonly role: UserRole
}
