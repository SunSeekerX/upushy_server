/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-08-10 21:00:51
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-10 21:15:22
 */

import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TasksService } from './tasks.service'
import { ProjectService } from '../project/project.service'
import { SourceService } from '../source/source.service'
import { ProjectEntity } from '../project/project.entity'
import { SourceEntity } from '../source/source.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, SourceEntity])],
  providers: [TasksService, ProjectService, SourceService],
})
export class TasksModule {}
