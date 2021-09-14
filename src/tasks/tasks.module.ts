/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-08-10 21:00:51
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 18:17:56
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TasksService } from './tasks.service'
import { ProjectService } from '../project/project.service'
import { SourceService } from '../source/source.service'
import { ProjectEntity } from '../project/entities'
import { SourceEntity } from '../source/entities'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, SourceEntity])],
  providers: [TasksService, ProjectService, SourceService],
})
export class TasksModule {}
