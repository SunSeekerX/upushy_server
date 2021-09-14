/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:56:01
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 18:34:25
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'
import { ProjectEntity } from './entities'
import { SourceService } from '../source/source.service'
import { SourceEntity } from '../source/entities'

import { TokenAuthMiddleware } from 'src/shared/middleware'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, SourceEntity])],
  controllers: [ProjectController],
  providers: [ProjectService, SourceService],
  exports: [ProjectService],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TokenAuthMiddleware).forRoutes(ProjectController)
  }
}
