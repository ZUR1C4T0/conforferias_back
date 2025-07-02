import { PartialType } from '@nestjs/mapped-types'
import { CreateDafoDto } from './create-dafo.dto'

export class UpdateDafoDto extends PartialType(CreateDafoDto) {}
