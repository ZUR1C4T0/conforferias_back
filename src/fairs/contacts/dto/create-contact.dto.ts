import { ApiProperty } from '@nestjs/swagger'
import { Amount, Contact, Potential } from '@prisma/client'
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator'

export class CreateContactDto
  implements
    Omit<Contact, 'id' | 'createdAt' | 'updatedAt' | 'fairId' | 'createdById'>
{
  @IsString()
  @IsNotEmpty()
  name: string

  @IsString()
  @IsEmail()
  email: string

  @IsString()
  @IsNotEmpty()
  phone: string

  @IsUUID()
  profileId: string

  @IsOptional()
  @IsString()
  otherProfile: string | null

  @IsOptional()
  @IsString()
  company: string | null

  @IsOptional()
  @IsString()
  companyNit: string | null

  @IsString()
  @IsNotEmpty()
  country: string

  @IsOptional()
  @IsString()
  city: string

  @IsEnum(Potential)
  @ApiProperty({ enum: Potential })
  estimatedPotential: Potential

  @IsOptional()
  @IsEnum(Amount)
  @ApiProperty({ enum: Amount })
  amount?: Amount | null
}
