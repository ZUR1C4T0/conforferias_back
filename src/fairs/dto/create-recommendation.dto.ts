import { FairRecommendation } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateRecommendationDto
  implements Pick<FairRecommendation, 'content'>
{
  @IsString()
  @IsNotEmpty()
  content: string
}
