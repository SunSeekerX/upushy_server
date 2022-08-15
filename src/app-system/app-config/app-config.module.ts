import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { getEnv } from 'src/app-shared/config'
import { AppConfigService } from './app-config.service'
import { AppConfigController } from './app-config.controller'
import { AppConfigEntity } from './entities'
import { TokenAuthMiddleware } from 'src/app-shared/middleware'

@Module({
  imports: [TypeOrmModule.forFeature([AppConfigEntity])],
  controllers: [AppConfigController],
  providers: [AppConfigService],
  exports: [AppConfigService],
})
export class AppConfigModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenAuthMiddleware)
      .exclude({ path: `${getEnv('API_GLOBAL_PREFIX')}/system/config`, method: RequestMethod.GET })
      .forRoutes(AppConfigController)
  }
}
