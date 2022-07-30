/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:56:09
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:29:26
 */

import { Get, Post, Body, Put, Delete, Query, Controller } from '@nestjs/common'
import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { UpushyProjectService } from './upushy-project.service'
import { UpushySourceService } from 'src/app-upushy/upushy-source/upushy-source.service'
import { RequestUser } from 'src/app-shared/decorator/request-user.decorator'
import type { UserEntity } from 'src/app-system/app-user/entities'
import { BaseResult } from 'src/app-shared/interface'
import { CreateProjectDto, DeleteProjectDto, UpdateProjectDto, QueryProjectDto } from './dto'
import { ApiResponseConstant } from 'src/app-shared/constant'

@ApiBearerAuth()
@ApiTags('业务模块 - 项目管理')
@Controller()
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
  @Post('project')
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
  @Delete('project')
  async onDeleteProject(@Body() deleteProjectDto: DeleteProjectDto): Promise<BaseResult> {
    const sourceCount = await this.upushySourceService.onFindSourceCountAll({
      projectId: deleteProjectDto.id,
    })
    if (sourceCount > 0) {
      return {
        statusCode: 400,
        message: '下有子项无法删除',
      }
    } else {
      const project = await this.upushyProjectService.onFindProjectOne(deleteProjectDto.id)

      if (project) {
        const res = await this.upushyProjectService.onDeleteProject(deleteProjectDto)

        return {
          statusCode: 200,
          message: '操作成功',
          data: res,
        }
      } else {
        return { statusCode: 200, message: '项目不存在' }
      }
    }
  }

  // 更新项目信息
  @ApiOperation({ summary: '项目管理 - 更新项目' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Put('project')
  async onUpdateProject(
    @Body() updateProjectDto: UpdateProjectDto,
    @RequestUser() requestUser: UserEntity
  ): Promise<BaseResult> {
    const project = await this.upushyProjectService.onFindProjectOne(updateProjectDto.id)
    if (!project) {
      return { statusCode: 200, message: '项目不存在' }
    }

    updateProjectDto.userId = requestUser.id

    const res = await this.upushyProjectService.onUpdateProject(updateProjectDto)
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
  @Get('projects')
  async onFindUserProjects(
    @Query() queryProjectDto: QueryProjectDto,
    @RequestUser() requestUser: UserEntity
  ): Promise<BaseResult> {
    queryProjectDto.userId = requestUser.id

    const count = await this.upushyProjectService.onFindProjectAllCount({
      where: {
        userId: queryProjectDto.userId,
      },
    })
    let res = []
    if (queryProjectDto.pageNum && queryProjectDto.pageSize) {
      res = await this.upushyProjectService.onFindProjectPaging(queryProjectDto)
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
