import { Module } from '@nestjs/common'
import { AchievementController } from './achievement.controller'
import { AchievementService } from './achievement.service'
import { ActivitiesController } from './activities.controller'
import { ActivitiesService } from './activities.service'
import { CompetitorsController } from './competitors.controller'
import { CompetitorsService } from './competitors.service'
import { ContactsController } from './contacts.controller'
import { ContactsService } from './contacts.service'
import { DafoController } from './dafo.controller'
import { DafoService } from './dafo.service'
import { FairEvaluationsController } from './fair-evaluations.controller'
import { FairEvaluationsService } from './fair-evaluations.service'
import { FairsController } from './fairs.controller'
import { FairsService } from './fairs.service'
import { ImprovementAreasController } from './improvement-areas.controller'
import { ImprovementAreasService } from './improvement-areas.service'
import { PostFairActionsController } from './post-fair-actions.controller'
import { PostFairActionsService } from './post-fair-actions.service'
import { RepresentativesController } from './representatives.controller'
import { RepresentativesService } from './representatives.service'
import { TrendsController } from './trends.controller'
import { TrendsService } from './trends.service'

@Module({
  imports: [],
  controllers: [
    FairsController,
    RepresentativesController,
    ContactsController,
    ActivitiesController,
    DafoController,
    CompetitorsController,
    TrendsController,
    PostFairActionsController,
    FairEvaluationsController,
    AchievementController,
    ImprovementAreasController,
  ],
  providers: [
    FairsService,
    RepresentativesService,
    ContactsService,
    ActivitiesService,
    DafoService,
    CompetitorsService,
    TrendsService,
    PostFairActionsService,
    FairEvaluationsService,
    AchievementService,
    ImprovementAreasService,
  ],
})
export class FairsModule {}
