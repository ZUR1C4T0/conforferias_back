import { FairCompetitor } from '@generated/prisma/client'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCompetitorDto
  implements
    Omit<
      FairCompetitor,
      'id' | 'fairId' | 'representativeId' | 'createdAt' | 'updatedAt'
    >
{
  @IsString()
  @IsNotEmpty()
  company: string

  @IsString()
  @IsNotEmpty()
  country: string

  @IsOptional()
  @IsString()
  city: string | null

  @IsString()
  @IsNotEmpty()
  featuredProducts: string

  @IsString()
  @IsNotEmpty()
  strengths: string

  @IsString()
  @IsNotEmpty()
  weaknesses: string
}
