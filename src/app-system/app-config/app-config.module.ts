import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

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
    consumer.apply(TokenAuthMiddleware).forRoutes(AppConfigController)
  }
}
