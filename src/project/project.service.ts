/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:56:19
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 18:14:30
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DeleteResult } from 'typeorm'
import type { FindManyOptions } from 'typeorm'

import { ProjectEntity } from './entities/project.entity'

import { CreateProjectDto, UpdateProjectDto, DeleteProjectDto, QueryProjectDto, QuerySourceDto } from './dto/index'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectEntity: Repository<ProjectEntity>
  ) {}

  // 获取项目总数
  async getProjectCount(options?: FindManyOptions<ProjectEntity>): Promise<number> {
    return await this.projectEntity.count(options)
  }

  // 查找单个项目
  async findOne(id: string): Promise<ProjectEntity> {
    return await this.projectEntity.findOne(id)
  }

  async findSource({ projectId }: QuerySourceDto) {
    return await this.projectEntity.find({
      where: {
        id: projectId,
      },
      relations: ['sources'],
    })
  }

  // 查找所有项目列表
  async findAll(): Promise<ProjectEntity[]> {
    return await this.projectEntity.find()
  }

  // 分页查询项目
  async queryProject({ userId, pageNum, pageSize }: QueryProjectDto): Promise<Array<ProjectEntity>> {
    return await this.projectEntity.find({
      where: {
        userId,
      },
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
    })
  }

  // 创建项目
  async create({ userId, name, describe }: CreateProjectDto): Promise<ProjectEntity> {
    const project = new ProjectEntity()
    project.userId = userId
    project.name = name
    project.describe = describe

    return await this.projectEntity.save(project)
  }

  // 更新项目
  async update({ id, name, describe }: UpdateProjectDto) {
    // const toUpdate = await this.projectEntity.findOne({ id })

    // const updated = Object.assign(toUpdate, {
    //   name,
    //   describe,
    // })

    // const updatedProject = await this.projectEntity.save(updated)
    return await this.projectEntity.update(id, {
      name,
      describe,
    })
  }

  // 删除项目
  async delete({ id }: DeleteProjectDto): Promise<DeleteResult> {
    return await this.projectEntity.delete(id)
  }
}
