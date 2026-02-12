import { ActivityType, ParallelActivity } from '@generated/prisma/client'
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator'

export class CreateActivityDto
  implements Pick<ParallelActivity, 'type' | 'description' | 'attendees'>
{
  @IsEnum(ActivityType)
  type: ActivityType

  @IsString()
  @IsNotEmpty()
  description: string

  @IsOptional()
  @IsNumber()
  @IsPositive()
  attendees: number | null
}
