/**
 * @name: 
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:03:43
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 00:54:54
 */

import { Module, Global } from '@nestjs/common'
import { BasicService } from './basic.service'
import { BasicController } from './basic.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoginLogEntity } from './entity/login.log.entity'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([LoginLogEntity])],
  providers: [BasicService],
  controllers: [BasicController],
  exports: [BasicService],
})
export class BasicModule {}
