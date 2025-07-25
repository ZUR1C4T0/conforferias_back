import { PartialType } from '@nestjs/mapped-types'
import { CreateTendencyDto } from './create-tendency.dto'

export class UpdateTendencyDto extends PartialType(CreateTendencyDto) {}
