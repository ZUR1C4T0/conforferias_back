import { Tendency } from '@generated/prisma/client'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateTendencyDto
  implements Omit<Tendency, 'id' | 'fairId' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @IsNotEmpty()
  title: string

  @IsOptional()
  @IsString()
  details: string | null
}
