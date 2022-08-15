/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:58:24
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 20:51:28
 */

import { Get, Post, Body, Patch, Delete, Query, Controller, Param } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { DeleteResult } from 'typeorm'
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { getEnv } from 'src/app-shared/config'
import { RequestUser } from 'src/app-shared/decorator/request-user.decorator'
import type { UserEntity } from 'src/app-system/app-user/entities'
import { BaseResult, PaginationResult, BaseIdDto } from 'src/app-shared/base'
import { ProjectEntity } from 'src/app-upushy/upushy-project/entities'
import { SourceEntity } from 'src/app-upushy/upushy-source/entities'
import { CreateSourceDto, UpdateSourceDto, QuerySourceDto, QueryLatestNativeVersionDto } from './dto'
import { UpushySourceService } from './upushy-source.service'
import { ApiResponseConstant } from 'src/app-shared/constant'
import { LatestNativeSourceVO } from './vo'

@ApiBearerAuth()
@ApiTags('业务模块 - 资源管理')
@Controller('/upushy/sources')
export class UpushySourceController {
  constructor(
    private readonly upushySourceService: UpushySourceService,

    @InjectRepository(ProjectEntity)
    private readonly projectEntity: Repository<ProjectEntity>
  ) {}

  // 添加资源
  @ApiOperation({ summary: '资源管理 - 添加资源' })
  @ApiResponse({
    type: BaseResult<SourceEntity>,
    ...ApiResponseConstant.RESPONSE_CODE_200,
  })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Post()
  async onCreateSource(
    @Body()
    createSourceDto: CreateSourceDto,
    @RequestUser() requestUser: UserEntity
  ): Promise<BaseResult<SourceEntity>> {
    const OSS_BASE_URL = `https://${getEnv('ALIYUN_OSS_BUCKET')}.${getEnv('ALIYUN_OSS_ENDPOINT')}.aliyuncs.com`
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
    const maxVersionCode = await this.upushySourceService.onFindMaxVersionCode({
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
      const nativeSource = await this.upushySourceService.onFindSourceOne({
        where: {
          type: createSourceDto.type + 2,
          versionCode: createSourceDto.nativeVersionCode,
        },
      })

      if (nativeSource) {
        const res = await this.upushySourceService.onCreateSource(createSourceDto, requestUser.id)
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
      const res = await this.upushySourceService.onCreateSource(createSourceDto, requestUser.id)
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
  @ApiOperation({ summary: '资源管理 - 删除资源' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Delete(':id')
  async onDeleteSource(@Param() { id }: BaseIdDto): Promise<BaseResult<DeleteResult>> {
    const source = await this.upushySourceService.onFindSourceOne({
      where: {
        id,
      },
    })

    if ([3, 4].includes(source.type)) {
      const count: number = await this.upushySourceService.onFindSourceCount({
        where: {
          nativeVersionCode: source.versionCode,
          type: source.type - 2,
          projectId: source.projectId,
        },
      })
      if (count !== 0) {
        return {
          statusCode: 400,
          message: '有 wgt 资源依赖该资源, 无法删除',
        }
      }
    }

    if (!source) {
      return { statusCode: 200, message: '资源不存在' }
    }
    const res = await this.upushySourceService.onDeleteSource(id)
    return { statusCode: 200, message: '操作成功', data: res }
  }

  // 更新资源
  @ApiOperation({ summary: '资源管理 - 更新资源' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Patch(':id')
  async onUpdateSource(
    @Param() { id }: BaseIdDto,
    @Body() updateSourceDto: UpdateSourceDto,
    @RequestUser() requestUser: UserEntity
  ): Promise<BaseResult<SourceEntity>> {
    const { versionCode } = updateSourceDto
    const source = await this.upushySourceService.onFindSourceOne({
      where: {
        id,
      },
    })
    const nativeVersionCode: number = updateSourceDto.nativeVersionCode || source.nativeVersionCode

    if (!source) {
      return { statusCode: 200, message: '资源不存在' }
    }

    // 相同类型的资源版本号必须递增
    const maxVersionCode = await this.upushySourceService.onFindMaxVersionCode({
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
      const nativeSource = await this.upushySourceService.onFindSourceOne({
        where: {
          type: source.type + 2,
          versionCode: nativeVersionCode,
        },
      })
      if (!nativeSource) {
        return {
          statusCode: 400,
          message: '原生版本资源不存在',
        }
      }
      const res = await this.upushySourceService.onUpdateSource(id, requestUser, updateSourceDto)
      return {
        statusCode: 200,
        message: '更新成功',
        data: res,
      }
    } else {
      if (nativeVersionCode && nativeVersionCode !== 0) {
        return {
          statusCode: 400,
          message: '原生资源无原生版本号',
        }
      }

      const res = await this.upushySourceService.onUpdateSource(id, requestUser, updateSourceDto)
      return {
        statusCode: 200,
        message: '更新成功',
        data: res,
      }
    }
  }

  // 查询资源列表
  @ApiOperation({ summary: '资源管理 - 获取项目下的资源' })
  @ApiResponse({
    type: PaginationResult<SourceEntity>,
    ...ApiResponseConstant.RESPONSE_CODE_200,
  })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get()
  async onFindSourcePaging(@Query() querySourceDto: QuerySourceDto): Promise<PaginationResult<SourceEntity>> {
    const { projectId, sortKey, order, type, pageNum, pageSize } = querySourceDto
    const OSS_BASE_URL = `https://${getEnv('ALIYUN_OSS_BUCKET')}.${getEnv('ALIYUN_OSS_ENDPOINT')}.aliyuncs.com`

    const total = await this.upushySourceService.onFindSourceCount({
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
      res = await this.upushySourceService.onFindSourcePaging(querySourceDto, orderCondition)
    } else {
      res = await this.upushySourceService.onFindSourceAll(querySourceDto, orderCondition)
    }

    for (const item of res) {
      if(item.type !== 4){
        if(item.uploadType === 1){
          // 本地上传拼接
          Object.assign(item, { url: `${getEnv('SERVER_DOMAIN')}/${item.url}` })
        } else {
          // oss 上传
          Object.assign(item, { url: `${OSS_BASE_URL}/${item.url}` })
        }
      }
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
  @ApiOperation({ summary: '资源管理 - 查询最新的原生版本' })
  @ApiResponse({
    type: LatestNativeSourceVO,
    status: 200,
    description: '操作成功222',
    // ...ApiResponseConstant.RESPONSE_CODE_200,
  })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get('native/latest')
  async onGetLatestNativeSource(@Query() queryObj: QueryLatestNativeVersionDto): Promise<LatestNativeSourceVO> {
    const { projectId } = queryObj

    const latestAndroid = await this.upushySourceService.onFindMaxSource({
      projectId,
      type: 3,
      status: 0,
    })
    const latestIos = await this.upushySourceService.onFindMaxSource({
      projectId,
      type: 4,
      status: 0,
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
