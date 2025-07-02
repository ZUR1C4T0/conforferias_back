import { Fair } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Validate,
} from 'class-validator'
import { EndDateValidator } from '../validators/end-date.validator'

export class CreateFairDto
  implements Omit<Fair, 'id' | 'createdAt' | 'updatedAt' | 'logoUrl'>
{
  @IsString()
  @IsNotEmpty()
  name: string

  @IsDate()
  startDate: Date

  @IsDate()
  @Validate(EndDateValidator)
  endDate: Date

  @IsString()
  @IsNotEmpty()
  country: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsString()
  @IsNotEmpty()
  standNumber: string

  @Transform(({ value }) => parseFloat(value), { toClassOnly: true })
  @IsNumber()
  @IsPositive()
  areaM2: number

  @IsOptional()
  @Transform(({ value }) => parseInt(value), { toClassOnly: true })
  @IsNumber()
  @IsPositive()
  totalInvestment: number | null
}
