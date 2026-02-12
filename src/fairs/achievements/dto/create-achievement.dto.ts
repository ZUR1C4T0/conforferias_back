import { FairAchievement } from '@generated/prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateAchievementDto implements Pick<FairAchievement, 'content'> {
  @IsString()
  @IsNotEmpty()
  content: string
}
