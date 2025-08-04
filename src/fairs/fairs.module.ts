import { Module } from '@nestjs/common'
import { AchievementsModule } from './achievements/achievements.module'
import { ActivitiesModule } from './activities/activities.module'
import { CompetitorsModule } from './competitors/competitors.module'
import { ContactsModule } from './contacts/contacts.module'
import { DafoModule } from './dafo/dafo.module'
import { DashboardController } from './dashboard.controller'
import { DashboardService } from './dashboard.service'
import { EvaluationsModule } from './evaluations/evaluations.module'
import { FairsController } from './fairs.controller'
import { FairsService } from './fairs.service'
import { ImprovementAreasModule } from './improvement-areas/improvement-areas.module'
import { RepresentativesController } from './representatives.controller'
import { RepresentativesService } from './representatives.service'
import { TendenciesModule } from './tendencies/tendencies.module'

@Module({
  imports: [
    ContactsModule,
    ActivitiesModule,
    DafoModule,
    CompetitorsModule,
    TendenciesModule,
    EvaluationsModule,
    AchievementsModule,
    ImprovementAreasModule,
  ],
  controllers: [
    FairsController,
    RepresentativesController,
    DashboardController,
  ],
  providers: [FairsService, RepresentativesService, DashboardService],
})
export class FairsModule {}
