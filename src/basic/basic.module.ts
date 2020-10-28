/**
 * @name: 
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:03:43
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 17:24:46
 */

import { Module, Global, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { BasicService } from './basic.service'
import { BasicController } from './basic.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoginLogEntity } from './entity/login.log.entity'

import { SignMiddleware } from 'src/shared/middleware/sign.middleware'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LoginLogEntity])],
  providers: [BasicService],
  controllers: [BasicController],
  exports: [BasicService],
})
export class BasicModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SignMiddleware).forRoutes(BasicController)
  }
}
