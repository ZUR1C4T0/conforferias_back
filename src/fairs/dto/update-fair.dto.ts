import { PartialType } from '@nestjs/swagger'
import { CreateFairDto } from './create-fair.dto'

export class UpdateFairDto extends PartialType(CreateFairDto) {}
