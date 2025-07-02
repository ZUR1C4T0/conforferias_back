import { Trend } from '@prisma/client'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTrendDto
  implements Omit<Trend, 'id' | 'fairId' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  details: string | null
}
