/**
 * 日志模块
 * @author: SunSeekerX
 * @Date: 2020-11-03 10:27:52
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:20:33
 */

import { Module, Global, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// import { logProviders } from './providers'
import { UpushyLogController } from './upushy-log.controller'
import { UpushyLogService } from './upushy-log.service'
import { LoginLogEntity, UpdateLogEntity, DeviceInfoLogEntity } from './entities'
import { TokenAuthMiddleware } from 'src/app-shared/middleware'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LoginLogEntity, UpdateLogEntity, DeviceInfoLogEntity])],
  controllers: [UpushyLogController],
  providers: [UpushyLogService],
  exports: [UpushyLogService],
})
export class UpushyLogModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(TokenAuthMiddleware).forRoutes(UpushyLogController)
  }
}
