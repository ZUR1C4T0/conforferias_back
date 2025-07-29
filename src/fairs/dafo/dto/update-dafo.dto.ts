import { PartialType } from '@nestjs/swagger'
import { CreateDafoDto } from './create-dafo.dto'

export class UpdateDafoDto extends PartialType(CreateDafoDto) {}
