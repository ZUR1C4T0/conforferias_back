import { FairRepresentative } from '@generated/prisma/client'
import { Type } from 'class-transformer'
import { IsArray, IsUUID, ValidateNested } from 'class-validator'

export class RepresentativeInput implements Pick<FairRepresentative, 'userId'> {
  @IsUUID()
  userId: string
}

export class AssignRepresentativesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RepresentativeInput)
  representatives: RepresentativeInput[]
}
