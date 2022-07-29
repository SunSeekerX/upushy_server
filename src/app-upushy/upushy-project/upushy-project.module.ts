/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:56:01
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 18:34:25
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// import { projectProviders } from './providers'
// import { sourceProviders } from '../upushy-source/providers'
import { ProjectEntity } from './entities'
import { SourceEntity } from '../upushy-source/entities'
import { UpushyProjectController } from './upushy-project.controller'
import { UpushyProjectService } from './upushy-project.service'
import { UpushySourceService } from '../upushy-source/upushy-source.service'
import { TokenAuthMiddleware } from 'src/app-shared/middleware'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, SourceEntity])],
  controllers: [UpushyProjectController],
  providers: [UpushyProjectService, UpushySourceService],
  exports: [UpushyProjectService],
})
export class UpushyProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TokenAuthMiddleware).forRoutes(UpushyProjectController)
  }
}
