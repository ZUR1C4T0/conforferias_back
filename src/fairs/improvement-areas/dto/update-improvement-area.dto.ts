import { PartialType } from '@nestjs/swagger'
import { CreateImprovementAreaDto } from './create-improvement-area.dto'

export class UpdateImprovementAreaDto extends PartialType(
  CreateImprovementAreaDto,
) {}
