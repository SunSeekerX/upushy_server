/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:58:16
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-07-11 15:11:43
 */

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
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
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware, SignMiddleware).forRoutes(SourceController)
  }
}
