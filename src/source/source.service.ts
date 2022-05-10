import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, getRepository, DeleteResult, FindManyOptions, FindOptionsOrder } from 'typeorm'

import { SourceEntity } from './entities'

import { CreateSourceDto, UpdateSourceDto, DeleteSourceDto, QuerySourceDto } from './dto/index'

@Injectable()
export class SourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceEntity: Repository<SourceEntity>
  ) {}

  // 添加资源
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
  async updateSource(updateSourceDto: UpdateSourceDto): Promise<SourceEntity> {
    const toUpdate = await this.sourceEntity.findOne({
      where: {
        id: updateSourceDto.id,
      },
    })
    const updated = Object.assign(toUpdate, updateSourceDto)

    return await this.sourceEntity.save(updated)
  }

  // 根据项目projectId & type查找最大的versionCode资源
  async queryMaxSource({ projectId, type, status }): Promise<SourceEntity | null> {
    const { max } = await getRepository(SourceEntity)
      .createQueryBuilder('app_source')
      .select('MAX(app_source.versionCode)', 'max')
      .where('app_source.projectId = :projectId and app_source.type = :type and status = :status', {
        projectId,
        type,
        status,
      })
      .getRawOne()

    return await this.sourceEntity.findOne({
      where: {
        projectId,
        versionCode: max,
        type,
      },
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
  async getSourceCount(options?: FindManyOptions<SourceEntity>): Promise<number> {
    return await this.sourceEntity.count(options)
  }

  // 查找单个资源
  async findOne(where: FindManyOptions<SourceEntity>): Promise<SourceEntity> {
    return await this.sourceEntity.findOne(where)
  }

  // 分页查找资源
  async querySource(
    { projectId, pageSize, pageNum, type }: QuerySourceDto,
    orderCondition: FindOptionsOrder<SourceEntity>
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
    orderCondition: FindOptionsOrder<SourceEntity>
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
  async querySourceTypeCount({ projectId, type }: QuerySourceDto): Promise<number> {
    return await this.sourceEntity.count({
      where: {
        type,
        projectId,
      },
    })
  }
}
