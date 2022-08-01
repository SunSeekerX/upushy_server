import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, DeleteResult, FindManyOptions, FindOptionsOrder } from 'typeorm'

import { genSnowFlakeId } from 'src/app-shared/utils'
import { SourceEntity } from './entities'
import { CreateSourceDto, UpdateSourceDto, QuerySourceDto } from './dto'
import type { UserEntity } from 'src/app-system/app-user/entities'

@Injectable()
export class UpushySourceService {
  constructor(
    @InjectRepository(SourceEntity)
    private readonly sourceRepo: Repository<SourceEntity>
  ) {}

  // 创建资源
  async onCreateSource(createSourceDto: CreateSourceDto, userId: string): Promise<SourceEntity> {
    const newSource = new SourceEntity()
    Object.assign(newSource, createSourceDto)
    newSource.id = genSnowFlakeId()
    newSource.createdBy = userId
    newSource.createdTime = new Date()
    return await this.sourceRepo.save(newSource)
  }

  // 删除资源
  async onDeleteSource(id: string): Promise<DeleteResult> {
    return await this.sourceRepo.delete({
      id,
    })
  }

  // 更新资源
  async onUpdateSource(id: string, requestUser: UserEntity, updateSourceDto: UpdateSourceDto): Promise<SourceEntity> {
    const toUpdateSource = await this.sourceRepo.findOne({
      where: {
        id,
      },
    })
    Object.assign(toUpdateSource, updateSourceDto)
    toUpdateSource.updatedBy = requestUser.id
    toUpdateSource.updatedTime = new Date()

    return await this.sourceRepo.save(toUpdateSource)
  }

  // 根据项目projectId & type查找最大的versionCode资源
  async onFindMaxSource({ projectId, type, status }): Promise<SourceEntity | null> {
    const { max } = await this.sourceRepo
      .createQueryBuilder('app_source')
      .select('MAX(app_source.versionCode)', 'max')
      .where('app_source.projectId = :projectId and app_source.type = :type and status = :status', {
        projectId,
        type,
        status,
      })
      .getRawOne()

    return await this.sourceRepo.findOne({
      where: {
        projectId,
        versionCode: max,
        type,
      },
    })
  }

  // 查找最大的版本号
  async onFindMaxVersionCode({ projectId, type }): Promise<number> {
    const { max } = await this.sourceRepo
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
  async onFindSourceCount(options?: FindManyOptions<SourceEntity>): Promise<number> {
    return await this.sourceRepo.count(options)
  }

  // 查找单个资源
  async onFindSourceOne(where: FindManyOptions<SourceEntity>): Promise<SourceEntity> {
    return await this.sourceRepo.findOne(where)
  }

  // 分页查找资源
  async onFindSourcePaging(
    { projectId, pageSize, pageNum, type }: QuerySourceDto,
    orderCondition: FindOptionsOrder<SourceEntity>
  ): Promise<SourceEntity[]> {
    return await this.sourceRepo.find({
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
  async onFindSourceAll(
    { projectId, type }: QuerySourceDto,
    orderCondition: FindOptionsOrder<SourceEntity>
  ): Promise<SourceEntity[]> {
    return await this.sourceRepo.find({
      where: {
        type,
        projectId,
      },
      order: orderCondition,
    })
  }

  // 查找全部资源数量
  async onFindSourceCountAll({ projectId }: QuerySourceDto): Promise<number> {
    return await this.sourceRepo.count({
      where: {
        projectId,
      },
    })
  }

  // 查找单类型全部资源数量
  async onFindSourceTypeCount({ projectId, type }: QuerySourceDto): Promise<number> {
    return await this.sourceRepo.count({
      where: {
        type,
        projectId,
      },
    })
  }
}
