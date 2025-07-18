import { ActionStatus, PostFairAction } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'

export class CreatePostFairActionDto
  implements Pick<PostFairAction, 'action' | 'limitDate' | 'status'>
{
  @IsString()
  @IsNotEmpty()
  action: string

  @Transform(({ value }) => new Date(value))
  @IsDate()
  limitDate: Date

  @IsOptional()
  @IsEnum(ActionStatus)
  status: ActionStatus
}
