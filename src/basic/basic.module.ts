/**
 * 基础模块
 * @author: SunSeekerX
 * @Date: 2021-09-13 23:30:37
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-15 00:25:05
 */

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { BasicService } from './basic.service'
import { BasicController } from './basic.controller'

import { getEnv } from 'src/app-shared/config'
import { ProjectModule } from 'src/project/project.module'
import { SourceModule } from 'src/source/source.module'
import { TokenAuthMiddleware } from 'src/shared/middleware'

@Module({
  imports: [ProjectModule, SourceModule],
  providers: [BasicService],
  controllers: [BasicController],
})
// export class BasicModule{}
export class BasicModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TokenAuthMiddleware)
      .exclude({
        path: `/${getEnv('API_GLOBAL_PREFIX')}/basic/config`,
        method: RequestMethod.GET,
      })
      .forRoutes(BasicController)
  }
}
