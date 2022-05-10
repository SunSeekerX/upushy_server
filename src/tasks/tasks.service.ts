/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-08-10 21:01:45
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-10 22:12:04
 */

import { Injectable, Logger } from '@nestjs/common'

import { ProjectService } from '../project/project.service'
import { SourceService } from '../source/source.service'

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name)

  constructor(private readonly sourceService: SourceService, private readonly projectService: ProjectService) {}

  // @Cron('*/3 * * * * *')
  // async handleCron() {
  //   /**
  //    * @description 每10s查询一次系统中所有的项目最大
  //    */
  //   // 查找系统中所有的项目
  //   const projects = await this.projectService.findAll()

  //   if (projects.length) {
  //     // 存在项目
  //     for (const project of projects) {
  //       // 查找最大的安卓wgt包
  //       const maxWgtAndtoid = await this.sourceService.queryMaxSource({
  //         projectId: project.id,
  //         type: 1,
  //       })

  //       // 查找最大的ios wgt包
  //       const maxWgtIos = await this.sourceService.queryMaxSource({
  //         projectId: project.id,
  //         type: 2,
  //       })

  //       // 查找最大的android包
  //       const maxAndroid = await this.sourceService.queryMaxSource({
  //         projectId: project.id,
  //         type: 3,
  //       })

  //       // 查找最大的ios包
  //       const maxIos = await this.sourceService.queryMaxSource({
  //         projectId: project.id,
  //         type: 4,
  //       })

  //       this.logger.debug({ maxWgtAndtoid, maxWgtIos, maxAndroid, maxIos })
  //     }
  //   }

  //   this.logger.log(new Date().toLocaleTimeString())
  // }
}
