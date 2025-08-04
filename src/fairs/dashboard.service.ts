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
    // Alternativa para nacionales/internacionales usando raw query si es necesario
    const [nationalityStats] = await this.prisma.$queryRaw<
      [{ national: `${number}`; international: `${number}` }]
    >`
    SELECT
      SUM(CASE WHEN LOWER(country) = 'colombia' THEN 1 ELSE 0 END) as national,
      SUM(CASE WHEN LOWER(country) != 'colombia' THEN 1 ELSE 0 END) as international
    FROM contact
    WHERE fairId = ${fairId};
  `
    // Procesamiento mínimo en JavaScript
    const topCountries = countryCounts.slice(0, 5).map((item) => ({
      country: item.country || 'Desconocido',
      count: item._count.country,
    }))
    const othersCount = countryCounts
      .slice(5)
      .reduce((sum, item) => sum + item._count.country, 0)
    // 3. Obtener los totales de ciudades colombianas
    const citiesStats = await this.prisma.$queryRaw<
      { city: string; count: `${number}` }[]
    >`
    SELECT
      LOWER(TRIM(city)) as city,
      COUNT(*) as count
    FROM contact
    WHERE
      fairId = ${fairId} AND
      country = 'Colombia' AND
      city IS NOT NULL
    GROUP BY city
    ORDER BY count DESC;
    `
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
        national: parseInt(nationalityStats.national),
        international: parseInt(nationalityStats.international),
        countries: [
          ...topCountries,
          ...(othersCount > 0
            ? [{ country: 'Otros', count: othersCount }]
            : []),
        ],
        cities: citiesStats.map((item) => ({
          city: item.city,
          count: parseInt(item.count),
        })),
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
