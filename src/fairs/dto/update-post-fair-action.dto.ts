import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreatePostFairActionDto } from './create-post-fair-action.dto'

export class UpdatePostFairActionDto extends PartialType(
  OmitType(CreatePostFairActionDto, ['action']),
) {}
