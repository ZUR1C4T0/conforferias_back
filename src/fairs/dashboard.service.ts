import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/database/prisma.service'

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboard(fairId: string) {
    // 1. Obtener el conteo de contactos por país directamente desde la base de datos
    const countryCounts = await this.prisma.contact.groupBy({
      where: { fairId },
      by: ['country'],
      _count: { country: true },
      orderBy: {
        _count: { country: 'desc' },
      },
    })
    // 2. Obtener los totales nacionales/internacionales en una sola consulta
    const totals = await this.prisma.contact.aggregate({
      where: { fairId },
      _count: true,
    })
    const [national, international] = await Promise.all([
      this.prisma.contact.count({
        where: {
          fairId,
          country: {
            equals: 'Colombia',
          },
        },
      }),
      this.prisma.contact.count({
        where: {
          fairId,
          country: {
            not: {
              equals: 'Colombia',
            },
          },
        },
      }),
    ])
    // Procesamiento mínimo en JavaScript
    const topCountries = countryCounts.slice(0, 5).map((item) => ({
      country: item.country || 'Desconocido',
      count: item._count.country,
    }))
    const othersCount = countryCounts
      .slice(5)
      .reduce((sum, item) => sum + item._count.country, 0)
    // 3. Obtener los totales de ciudades colombianas
    const citiesGrouped = await this.prisma.contact.groupBy({
      by: ['city'],
      where: {
        fairId,
        country: 'Colombia',
        city: {
          not: null,
        },
      },
      _count: {
        _all: true,
      },
    })
    citiesGrouped.sort((a, b) => b._count._all - a._count._all)
    const citiesStats = citiesGrouped.map((item) => ({
      city: item.city?.toLowerCase().trim() || '',
      count: item._count._all,
    }))
    // 4. Obtener los totales de los perfiles de visitantes
    const profilesStats = await this.prisma.contactProfile.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            contacts: {
              where: { fairId },
            },
          },
        },
      },
    })
    return {
      visitors: {
        total: totals._count,
        national,
        international,
        countries: [
          ...topCountries,
          ...(othersCount > 0
            ? [{ country: 'Otros', count: othersCount }]
            : []),
        ],
        cities: citiesStats,
        profiles: profilesStats
          .filter((item) => item._count.contacts > 0)
          .map((item) => ({
            id: item.id,
            name: item.name,
            contacts: item._count.contacts,
          })),
      },
    }
  }
}
