import { Module } from '@nestjs/common'
import { AppStatsService } from './app-stats.service'
import { AppStatsController } from './app-stats.controller'
import { AppUserModule } from 'src/app-system/app-user/app-user.module'
import { UpushyLogModule } from 'src/app-upushy/upushy-log/upushy-log.module'

@Module({
  imports: [AppUserModule, UpushyLogModule],
  providers: [AppStatsService],
  controllers: [AppStatsController],
})
export class AppStatsModule {}
