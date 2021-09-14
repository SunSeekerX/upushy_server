/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-11-03 10:27:52
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:31:09
 */

import { Module, Global, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { LogController } from './log.controller'
import { LogService } from './log.service'
import { LoginLogEntity, UpdateLogEntity, DeviceInfoLogEntity } from './entity/index'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LoginLogEntity, UpdateLogEntity, DeviceInfoLogEntity])],
  controllers: [LogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
