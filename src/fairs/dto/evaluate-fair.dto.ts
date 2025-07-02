import { FairEvaluation } from '@prisma/client'
import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator'

export class EvaluateFairDto
  implements Pick<FairEvaluation, 'score' | 'explanation'>
{
  @IsInt()
  @Min(1)
  @Max(10)
  score: number

  @IsString()
  @IsNotEmpty()
  explanation: string
}
