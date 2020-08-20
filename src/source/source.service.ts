/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:58:31
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-19 10:20:36
 */

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  Repository,
  getRepository,
  DeleteResult,
  Connection,
  FindConditions,
} from 'typeorm'

import { ProjectEntity } from 'src/project/project.entity'
import { SourceEntity } from './source.entity'

import {
  CreateSourceDto,
  UpdateSourceDto,
  DeleteSourceDto,
  QuerySourceDto,
} from './dto/index'

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceEntity: Repository<SourceEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectEntity: Repository<ProjectEntity>,
    private readonly connection: Connection,
  ) {}

  // 添加资源
  // async createSource({
  //   projectId,
  //   version,
  //   versionCode,
  //   nativeVersionCode,
  //   url,
  //   isForceUpdate,
  //   type,
  //   changelog,
  //   remark,
  // }: CreateSourceDto): Promise<SourceEntity> {
  //   const source = new SourceEntity()
  //   source.version = version
  //   source.versionCode = versionCode
  //   source.nativeVersionCode = nativeVersionCode
  //   source.url = url
  //   source.isForceUpdate = isForceUpdate
  //   source.type = type
  //   source.changelog = changelog
  //   source.remark = remark
  //   source.projectId = projectId

  //   return await this.sourceEntity.save(source)
  // }

  async createSource(createSourceDto: CreateSourceDto): Promise<SourceEntity> {
    const source = new SourceEntity()
    Object.assign(source, createSourceDto)

    return await this.sourceEntity.save(source)
  }

  // 删除资源
  async deleteSource({ id }: DeleteSourceDto): Promise<DeleteResult> {
    return await this.sourceEntity.delete(id)
  }

  // 更新资源
  async updateSource(updateSourceDto: UpdateSourceDto) {
    const toUpdate = await this.sourceEntity.findOne(updateSourceDto.id)
    const updated = Object.assign(toUpdate, updateSourceDto)

    return await this.sourceEntity.save(updated)
  }

  // 根据项目projectId & type查找最大的versionCode资源
  async queryMaxSource({ projectId, type, status }): Promise<SourceEntity> {
    const { max } = await getRepository(SourceEntity)
      .createQueryBuilder('app_source')
      .select('MAX(app_source.versionCode)', 'max')
      .where(
        'app_source.projectId = :projectId and app_source.type = :type and status = :status',
        {
          projectId,
          type,
          status,
        },
      )
      .getRawOne()

    return await this.sourceEntity.findOne({
      projectId,
      versionCode: max,
      type,
    })
  }

  // 查找最大的版本号
  async queryMaxVersionCode({ projectId, type }): Promise<number> {
    const { max } = await getRepository(SourceEntity)
      .createQueryBuilder('app_source')
      .select('MAX(app_source.versionCode)', 'max')
      .where('app_source.projectId = :projectId and app_source.type = :type', {
        projectId,
        type,
      })
      .getRawOne()

    return max
  }

  // 条件查找资源数量
  async getSourceCount(
    options?: FindConditions<SourceEntity>,
  ): Promise<number> {
    return await this.sourceEntity.count(options)
  }

  // 查找单个资源
  async findOne(where): Promise<SourceEntity> {
    return await this.sourceEntity.findOne(where)
  }

  // 分页查找资源
  async querySource(
    { projectId, pageSize, pageNum, type }: QuerySourceDto,
    orderCondition: {
      [P in keyof SourceEntity]?: 'ASC' | 'DESC' | 1 | -1
    },
  ): Promise<SourceEntity[]> {
    return await this.sourceEntity.find({
      take: pageSize,
      skip: (pageNum - 1) * pageSize,
      where: {
        type,
        projectId,
      },
      order: orderCondition,
    })
  }

  // 查找全部资源
  async querySourceAll(
    { projectId, type }: QuerySourceDto,
    orderCondition: {
      [P in keyof SourceEntity]?: 'ASC' | 'DESC' | 1 | -1
    },
  ): Promise<SourceEntity[]> {
    return await this.sourceEntity.find({
      where: {
        type,
        projectId,
      },
      order: orderCondition,
    })
  }

  // 查找全部资源数量
  async querySourceCount({ projectId }: QuerySourceDto): Promise<number> {
    return await this.sourceEntity.count({
      where: {
        projectId,
      },
    })
  }

  // 查找单类型全部资源数量
  async querySourceTypeCount({
    projectId,
    type,
  }: QuerySourceDto): Promise<number> {
    return await this.sourceEntity.count({
      where: {
        type,
        projectId,
      },
    })
  }
}
