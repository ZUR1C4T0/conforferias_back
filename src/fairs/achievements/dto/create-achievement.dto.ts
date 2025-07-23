import { FairAchievement } from '@prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAchievementDto implements Pick<FairAchievement, 'content'> {
  @IsString()
  @IsNotEmpty()
  content: string
}
