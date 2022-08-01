/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:56:09
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:29:26
 */

import { Get, Post, Body, Put, Delete, Query, Controller, Param, Patch } from '@nestjs/common'
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { UpushyProjectService } from './upushy-project.service'
import { CreateProjectDto, DeleteProjectDto, UpdateProjectDto, QueryProjectDto } from './dto'
import { UpushySourceService } from 'src/app-upushy/upushy-source/upushy-source.service'
import { RequestUser } from 'src/app-shared/decorator/request-user.decorator'
import type { UserEntity } from 'src/app-system/app-user/entities'
import { BaseResult } from 'src/app-shared/interface'
import { ApiResponseConstant } from 'src/app-shared/constant'
import { BaseIdDto } from 'src/app-shared/base'

@ApiBearerAuth()
@ApiTags('业务模块 - 项目管理')
@Controller('/upushy/projects')
export class UpushyProjectController {
  constructor(
    private readonly upushySourceService: UpushySourceService,
    private readonly upushyProjectService: UpushyProjectService
  ) {}

  // 创建项目
  @ApiOperation({ summary: '项目管理 - 创建项目' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_201)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Post()
  async onCreateProject(
    @Body() createProjectDto: CreateProjectDto,
    @RequestUser() requestUser: UserEntity
  ): Promise<BaseResult> {
    createProjectDto.userId = requestUser.id
    const res = await this.upushyProjectService.onCreateProject(createProjectDto)

    if (res) {
      return {
        statusCode: 200,
        message: '创建成功',
        data: res,
      }
    }
  }

  // 删除项目
  @ApiOperation({ summary: '项目管理 - 删除项目' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Delete(':id')
  async onDeleteProject(@Param() { id }: BaseIdDto): Promise<BaseResult> {
    const sourceCount = await this.upushySourceService.onFindSourceCountAll({
      projectId: id,
    })
    if (sourceCount > 0) {
      return {
        statusCode: 400,
        message: '下有子项无法删除',
      }
    } else {
      const project = await this.upushyProjectService.onFindProjectOne(id)

      if (!project) {
        return { statusCode: 200, message: '项目不存在' }
      }
      const res = await this.upushyProjectService.onDeleteProjectById(id)

      return {
        statusCode: 200,
        message: '操作成功',
        data: res,
      }
    }
  }

  // 更新项目信息
  @ApiOperation({ summary: '项目管理 - 更新项目' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Patch(':id')
  async onUpdateProject(
    @Param() { id }: BaseIdDto,
    @Body() updateProjectDto: UpdateProjectDto,
    @RequestUser() requestUser: UserEntity
  ): Promise<BaseResult> {
    const project = await this.upushyProjectService.onFindProjectOne(id)
    if (!project) {
      return { statusCode: 200, message: '项目不存在' }
    }

    const res = await this.upushyProjectService.onUpdateProject(id, requestUser, updateProjectDto)
    return {
      statusCode: 200,
      message: '更新成功',
      data: res,
    }
  }

  // 获取项目列表
  @ApiOperation({ summary: '项目管理 - 根据用户 id 获取用户的项目' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get()
  async onFindUserProjects(
    @Query() queryProjectDto: QueryProjectDto,
    @RequestUser() requestUser: UserEntity
  ): Promise<BaseResult> {
    const count = await this.upushyProjectService.onFindProjectAllCount({
      where: {
        userId: requestUser.id,
      },
    })
    let res = []
    if (queryProjectDto.pageNum && queryProjectDto.pageSize) {
      res = await this.upushyProjectService.onFindProjectPagingByUserId(requestUser.id, queryProjectDto)
    } else {
      res = await this.upushyProjectService.onFindUserProjects(requestUser.id)
    }

    return {
      statusCode: 200,
      message: '查询成功',
      data: {
        total: count,
        records: res,
      },
    }
  }
}
