/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:56:19
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 18:14:30
 */

import { Injectable } from '@nestjs/common'
import { Repository, DeleteResult } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import type { FindManyOptions } from 'typeorm'

import { genSnowFlakeId } from 'src/app-shared/utils'
import { ProjectEntity } from './entities/project.entity'
import type { UserEntity } from 'src/app-system/app-user/entities'

import { CreateProjectDto, UpdateProjectDto, DeleteProjectDto, QueryProjectDto, QuerySourceDto } from './dto'

@Injectable()
export class UpushyProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>
  ) {}

  // 获取项目总数
  async onFindProjectAllCount(options?: FindManyOptions<ProjectEntity>): Promise<number> {
    return await this.projectRepo.count(options)
  }

  // 查找单个项目
  async onFindProjectOne(id: string): Promise<ProjectEntity> {
    return await this.projectRepo.findOne({
      where: {
        id,
      },
    })
  }

  // 根据项目 id 获取资源
  async onFindProjectSource({ projectId }: QuerySourceDto) {
    return await this.projectRepo.find({
      where: {
        id: projectId,
      },
      relations: ['sources'],
    })
  }

  // 查找所有项目列表
  async onFindUserProjects(userId: string): Promise<ProjectEntity[]> {
    return await this.projectRepo.find({
      where: {
        userId,
      },
    })
  }

  // 分页查询项目
  async onFindProjectPagingByUserId(
    userId: string,
    { pageNum, pageSize }: QueryProjectDto
  ): Promise<Array<ProjectEntity>> {
    return await this.projectRepo.find({
      where: {
        userId,
      },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
    })
  }

  // 创建项目
  async onCreateProject({ userId, name, describe }: CreateProjectDto): Promise<ProjectEntity> {
    const project = new ProjectEntity()
    project.id = genSnowFlakeId()
    project.createdTime = new Date()
    project.createdBy = userId
    project.userId = userId
    project.name = name
    project.describe = describe

    return await this.projectRepo.save(project)
  }

  // 更新项目
  async onUpdateProject(id: string, requestUser: UserEntity, { name, describe }: UpdateProjectDto) {
    return await this.projectRepo.update(id, {
      name,
      describe,
      updatedBy: requestUser.id,
      updatedTime: new Date(),
    })
  }

  // 删除项目
  async onDeleteProjectById(id: string): Promise<DeleteResult> {
    return await this.projectRepo.delete(id)
  }
}
