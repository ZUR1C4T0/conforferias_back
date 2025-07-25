import { Fair } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  Validate,
} from 'class-validator'
import { EndDateValidator } from '../validators/end-date.validator'

export class CreateFairDto
  implements Omit<Fair, 'id' | 'createdAt' | 'updatedAt' | 'logoUrl'>
{
  @IsString()
  @IsNotEmpty()
  name: string

  @Transform(({ value }) => new Date(value))
  @IsDate()
  startDate: Date

  @Transform(({ value }) => new Date(value))
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

  @IsNumber()
  @IsPositive()
  areaM2: number

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalInvestment: number | null
}
