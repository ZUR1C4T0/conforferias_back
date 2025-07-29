import { PartialType } from '@nestjs/swagger'
import { CreateTendencyDto } from './create-tendency.dto'

export class UpdateTendencyDto extends PartialType(CreateTendencyDto) {}
