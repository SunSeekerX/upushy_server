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

import { ProjectEntity } from './entities/project.entity'
import { PROJECT_REPOSITORY } from 'src/app-shared/constant'

import { CreateProjectDto, UpdateProjectDto, DeleteProjectDto, QueryProjectDto, QuerySourceDto } from './dto/index'

@Injectable()
export class UpushyProjectService {
  constructor(
    // @Inject(PROJECT_REPOSITORY)
    // private projectRepo: Repository<ProjectEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepo: Repository<ProjectEntity>
  ) {}

  // 获取项目总数
  async getProjectCount(options?: FindManyOptions<ProjectEntity>): Promise<number> {
    return await this.projectRepo.count(options)
  }

  // 查找单个项目
  async findOne(id: string): Promise<ProjectEntity> {
    return await this.projectRepo.findOne({
      where: {
        id,
      },
    })
  }

  async findSource({ projectId }: QuerySourceDto) {
    return await this.projectRepo.find({
      where: {
        id: projectId,
      },
      relations: ['sources'],
    })
  }

  // 查找所有项目列表
  async findAll(): Promise<ProjectEntity[]> {
    return await this.projectRepo.find()
  }

  // 分页查询项目
  async queryProject({ userId, pageNum, pageSize }: QueryProjectDto): Promise<Array<ProjectEntity>> {
    return await this.projectRepo.find({
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

    return await this.projectRepo.save(project)
  }

  // 更新项目
  async update({ id, name, describe }: UpdateProjectDto) {
    // const toUpdate = await this.projectRepo.findOne({ id })

    // const updated = Object.assign(toUpdate, {
    //   name,
    //   describe,
    // })

    // const updatedProject = await this.projectRepo.save(updated)
    return await this.projectRepo.update(id, {
      name,
      describe,
    })
  }

  // 删除项目
  async delete({ id }: DeleteProjectDto): Promise<DeleteResult> {
    return await this.projectRepo.delete(id)
  }
}
