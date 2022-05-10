/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:58:24
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 20:51:28
 */

import { Get, Post, Body, Put, Delete, Query, Controller } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'

import { BaseResult, PagingResult } from 'src/shared/interface'
import { ProjectEntity } from 'src/project/entities'
import { SourceEntity } from 'src/source/entities'
import {
  CreateSourceDto,
  DeleteSourceDto,
  UpdateSourceDto,
  QuerySourceDto,
  QueryLatestNativeVersionDto,
} from './dto/index'
import { SourceService } from './source.service'

@ApiBearerAuth()
@ApiTags('Source')
@Controller('source')
export class SourceController {
  constructor(
    private readonly sourceService: SourceService,

    @InjectRepository(ProjectEntity)
    private readonly projectEntity: Repository<ProjectEntity>
  ) {}

  // 添加资源
  @ApiOperation({ summary: 'Create source' })
  @ApiResponse({
    status: 201,
    description: 'The source has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post()
  async addSource(
    @Body()
    createSourceDto: CreateSourceDto
  ): Promise<BaseResult> {
    const OSS_BASE_URL = `https://${getEnv('ALIYUN_OSS_BUCKET', EnvType.string)}.${getEnv(
      'ALIYUN_OSS_ENDPOINT',
      EnvType.string
    )}.aliyuncs.com`
    const project = await this.projectEntity.findOne({
      where: {
        id: createSourceDto.projectId,
      },
    })
    // 检查项目是否存在
    if (!project) {
      return { statusCode: 200, message: '项目不存在' }
    }

    // 相同类型的资源版本号必须递增
    const maxVersionCode = await this.sourceService.queryMaxVersionCode({
      projectId: createSourceDto.projectId,
      type: createSourceDto.type,
    })

    if (createSourceDto.versionCode <= maxVersionCode) {
      return {
        statusCode: 400,
        message: `最低版本号必须大于：${maxVersionCode}`,
      }
    }

    // 检查wgt类型的原生类型是否存在
    if ([1, 2].includes(createSourceDto.type)) {
      const nativeSource = await this.sourceService.findOne({
        where: {
          type: createSourceDto.type + 2,
          versionCode: createSourceDto.nativeVersionCode,
        },
      })

      if (nativeSource) {
        const res = await this.sourceService.createSource(createSourceDto)
        res.type !== 4 &&
          Object.assign(res, {
            url: `${OSS_BASE_URL}/${res.url}`,
          })
        return {
          statusCode: 200,
          message: '操作成功',
          data: res,
        }
      } else {
        return {
          statusCode: 400,
          message: '原生版本资源不存在',
        }
      }
    } else {
      if (createSourceDto.nativeVersionCode !== 0) {
        return {
          statusCode: 400,
          message: '原生资源无原生版本号',
        }
      }
      const res = await this.sourceService.createSource(createSourceDto)
      res.type !== 4 &&
        Object.assign(res, {
          url: `${OSS_BASE_URL}/${res.url}`,
        })
      return {
        statusCode: 200,
        message: '操作成功',
        data: res,
      }
    }
  }

  // 删除资源
  @ApiOperation({ summary: 'Delete source' })
  @ApiResponse({
    status: 201,
    description: 'The source has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete()
  async delete(@Body() deleteSourceDto: DeleteSourceDto): Promise<BaseResult> {
    const source = await this.sourceService.findOne({
      where: {
        id: deleteSourceDto.id,
      },
    })

    if ([3, 4].includes(source.type)) {
      const count: number = await this.sourceService.getSourceCount({
        where: {
          nativeVersionCode: source.versionCode,
          type: source.type - 2,
          projectId: source.projectId,
        },
      })
      if (count !== 0) {
        return {
          statusCode: 400,
          message: '有wgt资源依赖该资源，无法删除',
        }
      }
    }

    if (source) {
      const res = await this.sourceService.deleteSource(deleteSourceDto)
      return { statusCode: 200, message: '操作成功', data: res }
    } else {
      return { statusCode: 200, message: '资源不存在' }
    }
  }

  // 更新资源
  @ApiOperation({ summary: 'Update source' })
  @ApiResponse({
    status: 200,
    description: 'The source has been successfully Updated.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Put()
  async update(@Body() updateSourceDto: UpdateSourceDto): Promise<BaseResult> {
    const { id, versionCode } = updateSourceDto
    const source = await this.sourceService.findOne({
      where: {
        id,
      },
    })
    const nativeVersionCode: number = updateSourceDto.nativeVersionCode || source.nativeVersionCode

    if (!source) {
      return { statusCode: 200, message: '资源不存在' }
    }

    // 相同类型的资源版本号必须递增
    const maxVersionCode = await this.sourceService.queryMaxVersionCode({
      projectId: source.projectId,
      type: source.type,
    })

    if (versionCode !== source.versionCode && versionCode <= maxVersionCode) {
      return {
        statusCode: 400,
        message: `最低版本号必须大于：${maxVersionCode}`,
      }
    }

    // 检查wgt类型的原生类型是否存在
    if ([1, 2].includes(source.type)) {
      const nativeSource = await this.sourceService.findOne({
        where: {
          type: source.type + 2,
          versionCode: nativeVersionCode,
        },
      })
      if (nativeSource) {
        const res = await this.sourceService.updateSource(updateSourceDto)
        return {
          statusCode: 200,
          message: '更新成功',
          data: res,
        }
      } else {
        return {
          statusCode: 400,
          message: '原生版本资源不存在',
        }
      }
    } else {
      if (nativeVersionCode && nativeVersionCode !== 0) {
        return {
          statusCode: 400,
          message: '原生资源无原生版本号',
        }
      }

      const res = await this.sourceService.updateSource(updateSourceDto)
      return {
        statusCode: 200,
        message: '更新成功',
        data: res,
      }
    }
  }

  // 查询资源列表
  @ApiOperation({ summary: 'Get project sources' })
  @ApiResponse({
    status: 200,
    description: 'Successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get()
  async getSource(@Query() querySourceDto: QuerySourceDto): Promise<PagingResult> {
    const { projectId, sortKey, order, type, pageNum, pageSize } = querySourceDto
    const OSS_BASE_URL = `https://${getEnv('ALIYUN_OSS_BUCKET', EnvType.string)}.${getEnv(
      'ALIYUN_OSS_ENDPOINT',
      EnvType.string
    )}.aliyuncs.com`

    const total = await this.sourceService.getSourceCount({
      where: {
        projectId,
        type,
      },
    })

    let res: Array<SourceEntity> = []
    // let orderCondition = {}
    const orderCondition = {}
    sortKey && (orderCondition[sortKey] = order)

    if (pageNum && pageSize) {
      res = await this.sourceService.querySource(querySourceDto, orderCondition)
    } else {
      res = await this.sourceService.querySourceAll(querySourceDto, orderCondition)
    }

    for (const item of res) {
      item.type !== 4 && Object.assign(item, { url: `${OSS_BASE_URL}/${item.url}` })
    }

    return {
      statusCode: 200,
      message: '查询成功',
      data: {
        total,
        records: res,
      },
    }
  }

  // 查询最新的原生版本
  @ApiOperation({ summary: 'Get latest native sources' })
  @ApiResponse({
    status: 200,
    description: 'Successfully.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Get('native/latest')
  async getLatestNativeSource(@Query() queryObj: QueryLatestNativeVersionDto): Promise<BaseResult> {
    const { projectId } = queryObj

    const latestAndroid = await this.sourceService.queryMaxSource({
      projectId,
      type: 3,
      status: 1,
    })
    const latestIos = await this.sourceService.queryMaxSource({
      projectId,
      type: 4,
      status: 1,
    })

    return {
      statusCode: 200,
      message: '查询成功',
      data: {
        android: latestAndroid?.versionCode,
        ios: latestIos?.versionCode,
      },
    }
  }
}
