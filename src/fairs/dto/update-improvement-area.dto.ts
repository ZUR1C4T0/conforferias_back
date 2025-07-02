import { PartialType } from '@nestjs/mapped-types'
import { CreateImprovementAreaDto } from './create-improvement-area.dto'

export class UpdateImprovementAreaDto extends PartialType(
  CreateImprovementAreaDto,
) {}
