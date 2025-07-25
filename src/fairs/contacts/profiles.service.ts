import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'

@Injectable()
export class ProfilesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.contactProfile.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        _count: {
          select: { contacts: true },
        },
      },
    })
  }
}
