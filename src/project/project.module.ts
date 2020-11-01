/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:56:01
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-01 20:35:18
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ProjectController } from './project.controller'
import { ProjectService } from './project.service'
import { ProjectEntity } from './project.entity'
import { SourceService } from '../source/source.service'
import { SourceEntity } from '../source/source.entity'

import { AuthMiddleware } from 'src/shared/middleware/auth.middleware'
import { SignMiddleware } from 'src/shared/middleware/sign.middleware'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, SourceEntity])],
  controllers: [ProjectController],
  providers: [ProjectService, SourceService],
  exports: [ProjectService],
})
export class ProjectModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AuthMiddleware, SignMiddleware).forRoutes(ProjectController)
  }
}
