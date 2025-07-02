import { Position } from '@prisma/client'
import { IsOptional, IsString, MinLength } from 'class-validator'

export class CreatePositionDto
  implements Omit<Position, 'id' | 'createdAt' | 'updatedAt'>
{
  @IsString()
  @MinLength(3)
  readonly name: string

  @IsOptional()
  @IsString()
  readonly description: string | null
}
