/**
 * 基础模块
 * @author: SunSeekerX
 * @Date: 2021-09-13 23:30:37
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:30:59
 */

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { BasicService } from './basic.service'
import { BasicController } from './basic.controller'

import { ProjectModule } from 'src/project/project.module'
import { SourceModule } from 'src/source/source.module'

@Module({
  imports: [ProjectModule, SourceModule],
  providers: [BasicService],
  controllers: [BasicController],
})
export class BasicModule{}
