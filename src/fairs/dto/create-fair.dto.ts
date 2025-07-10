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

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  startDate: Date

  @Transform(({ value }) => new Date(value), { toClassOnly: true })
  @IsDate()
  @Validate(EndDateValidator)
  endDate: Date

  @IsString()
  @IsNotEmpty()
  country: string

  @IsOptional()
  @IsString()
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
