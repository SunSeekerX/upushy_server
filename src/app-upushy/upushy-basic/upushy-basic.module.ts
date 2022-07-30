/**
 * 基础模块
 * @author: SunSeekerX
 * @Date: 2021-09-13 23:30:37
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-15 00:25:05
 */

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { UpushyBasicService } from './upushy-basic.service'
import { UpushyBasicController } from './upushy-basic.controller'

import { getEnv } from 'src/app-shared/config'
import { UpushyProjectModule } from 'src/app-upushy/upushy-project/upushy-project.module'
import { UpushySourceModule } from 'src/app-upushy/upushy-source/upushy-source.module'
import { TokenAuthMiddleware } from 'src/app-shared/middleware'

@Module({
  imports: [UpushyProjectModule, UpushySourceModule],
  providers: [UpushyBasicService],
  controllers: [UpushyBasicController],
})
// export class BasicModule{}
export class UpushyBasicModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(TokenAuthMiddleware)
      .exclude({
        path: `${getEnv('API_GLOBAL_PREFIX')}/basic/config`,
        method: RequestMethod.GET,
      })
      .forRoutes(UpushyBasicController)
  }
}
