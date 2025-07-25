import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'
import { CreateDafoDto } from './dto/create-dafo.dto'
import { UpdateDafoDto } from './dto/update-dafo.dto'

@Injectable()
export class DafoService {
  constructor(private readonly prisma: PrismaService) {}

  async create(fairId: string, userId: string, dto: CreateDafoDto) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    return this.prisma.dafoAnalysis.create({
      data: {
        fairId,
        representativeId: rep.id,
        ...dto,
      },
    })
  }

  async findAll(fairId: string) {
    return await this.prisma.dafoAnalysis.findMany({
      where: { fairId },
      orderBy: { type: 'asc' },
    })
  }

  async update(
    fairId: string,
    dafoId: string,
    userId: string,
    dto: UpdateDafoDto,
  ) {
    const rep = await this.prisma.fairRepresentative.findUnique({
      where: { fairId_userId: { fairId, userId } },
      select: { id: true },
    })
    if (!rep) throw new ForbiddenException()
    const dafo = await this.prisma.dafoAnalysis.findUnique({
      where: { id: dafoId },
      select: { id: true },
    })
    if (!dafo) throw new NotFoundException('Elemento del DAFO no encontrado')
    return this.prisma.dafoAnalysis.update({
      where: { id: dafo.id },
      data: dto,
    })
  }
}
