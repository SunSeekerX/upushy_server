/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:58:16
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-01 20:37:37
 */

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { SourceController } from './source.controller'
import { SourceService } from './source.service'
import { SourceEntity } from './source.entity'
import { ProjectEntity } from 'src/project/project.entity'

import { AuthMiddleware } from 'src/shared/middleware/auth.middleware'
import { SignMiddleware } from 'src/shared/middleware/sign.middleware'

@Module({
  imports: [TypeOrmModule.forFeature([SourceEntity, ProjectEntity])],
  controllers: [SourceController],
  providers: [SourceService],
  exports: [SourceService],
})
export class SourceModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware, SignMiddleware).exclude({
      path: '/api/user/token',
      method: RequestMethod.POST,
    }).forRoutes(SourceController)
  }
}
