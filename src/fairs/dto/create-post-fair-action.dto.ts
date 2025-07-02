import { ActionStatus, PostFairAction } from '@prisma/client'
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

  @IsDate()
  limitDate: Date

  @IsOptional()
  @IsEnum(ActionStatus)
  status: ActionStatus
}
