import { ImprovementArea } from '@generated/prisma/client'
import { IsNotEmpty, IsString } from 'class-validator'

export class CreateImprovementAreaDto
  implements Pick<ImprovementArea, 'content'>
{
  @IsString()
  @IsNotEmpty()
  content: string
}
