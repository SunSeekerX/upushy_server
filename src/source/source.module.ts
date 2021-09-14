/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:58:16
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 18:16:30
 */

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SourceController } from './source.controller'
import { SourceService } from './source.service'
import { SourceEntity } from './entities'
import { ProjectEntity } from 'src/project/entities'

import { TokenAuthMiddleware } from 'src/shared/middleware'

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity, ProjectEntity])],
  controllers: [SourceController],
  providers: [SourceService],
  exports: [SourceService],
})
export class SourceModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TokenAuthMiddleware)
      .exclude({
        path: '/api/user/token',
        method: RequestMethod.POST,
      })
      .forRoutes(SourceController)
  }
}
