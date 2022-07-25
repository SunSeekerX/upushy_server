/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:56:09
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:29:26
 */

import { Get, Post, Body, Put, Delete, Query, Controller } from '@nestjs/common'

import { UpushyProjectService } from './upushy-project.service'
import { UpushySourceService } from 'src/app-upushy/upushy-source/upushy-source.service'
import { RequestUser } from 'src/app-shared/decorator/request-user.decorator'

import { BaseResult } from 'src/app-shared/interface'

import { CreateProjectDto, DeleteProjectDto, UpdateProjectDto, QueryProjectDto } from './dto/index'

import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Project')
@Controller()
export class UpushyProjectController {
  constructor(private readonly upushySourceService: UpushySourceService, private readonly upushyProjectService: UpushyProjectService) {}

  // 创建项目
  @ApiOperation({ summary: 'Create project' })
  @ApiResponse({
    status: 201,
    description: '创建成功',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('project')
  async create(@Body() createProjectDto: CreateProjectDto, @RequestUser() user): Promise<BaseResult> {
    createProjectDto.userId = user.id
    const res = await this.upushyProjectService.create(createProjectDto)

    if (res) {
      return {
        statusCode: 200,
        message: '创建成功',
        data: res,
      }
    }
  }

  // 删除项目
  @ApiOperation({ summary: 'Delete project' })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Delete('project')
  async delete(@Body() deleteProjectDto: DeleteProjectDto): Promise<BaseResult> {
    const sourceCount = await this.upushySourceService.querySourceCount({
      projectId: deleteProjectDto.id,
    })
    if (sourceCount > 0) {
      return {
        statusCode: 400,
        message: '下有子项无法删除',
      }
    } else {
      const project = await this.upushyProjectService.findOne(deleteProjectDto.id)

      if (project) {
        const res = await this.upushyProjectService.delete(deleteProjectDto)

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
  @ApiOperation({ summary: 'Update project' })
  @Put('project')
  async update(@Body() updateProjectDto: UpdateProjectDto): Promise<BaseResult> {
    const project = await this.upushyProjectService.findOne(updateProjectDto.id)
    if (!project) {
      return { statusCode: 200, message: '项目不存在' }
    }

    const res = await this.upushyProjectService.update(updateProjectDto)
    return {
      statusCode: 200,
      message: '更新成功',
      data: res,
    }
  }

  // 获取项目列表
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects.' })
  @Get('projects')
  async getProjects(@Query() queryProjectDto: QueryProjectDto, @RequestUser() user): Promise<BaseResult> {
    queryProjectDto.userId = user.id

    const count = await this.upushyProjectService.getProjectCount({
      where: {
        userId: queryProjectDto.userId,
      },
    })
    let res = []
    if (queryProjectDto.pageNum && queryProjectDto.pageSize) {
      res = await this.upushyProjectService.queryProject(queryProjectDto)
    } else {
      res = await this.upushyProjectService.findAll()
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
