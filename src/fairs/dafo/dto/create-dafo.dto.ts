import { DafoType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsString } from 'class-validator'

export class CreateDafoDto {
  @IsEnum(DafoType)
  type: DafoType

  @IsString()
  @IsNotEmpty()
  description: string
}
