/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:56:09
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-12 23:46:04
 */

import { Get, Post, Body, Put, Delete, Query, Controller } from '@nestjs/common'

import { ProjectService } from './project.service'
import { SourceService } from 'src/source/source.service'
import { User } from 'src/shared/decorator/user.decorator'

import { ResponseRO } from 'src/shared/interface/response.interface'

import { CreateProjectDto, DeleteProjectDto, UpdateProjectDto, QueryProjectDto } from './dto/index'

import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

@ApiBearerAuth()
@ApiTags('Project')
@Controller()
export class ProjectController {
  constructor(private readonly sourceService: SourceService, private readonly projectService: ProjectService) {}

  // 创建项目
  @ApiOperation({ summary: 'Create project' })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @Post('project')
  async create(@Body() createProjectDto: CreateProjectDto, @User() user): Promise<ResponseRO> {
    createProjectDto.userId = user.id
    const res = await this.projectService.create(createProjectDto)

    if (res) {
      return {
        success: true,
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
  async delete(@Body() deleteProjectDto: DeleteProjectDto): Promise<ResponseRO> {
    const sourceCount = await this.sourceService.querySourceCount({
      projectId: deleteProjectDto.id,
    })
    if (sourceCount > 0) {
      return {
        success: false,
        statusCode: 400,
        message: '下有子项无法删除',
      }
    } else {
      const project = await this.projectService.findOne(deleteProjectDto.id)

      if (project) {
        const res = await this.projectService.delete(deleteProjectDto)

        return {
          success: true,
          statusCode: 200,
          message: '操作成功',
          data: res,
        }
      } else {
        return { success: false, statusCode: 200, message: '项目不存在' }
      }
    }
  }

  // 更新项目信息
  @ApiOperation({ summary: 'Update project' })
  @Put('project')
  async update(@Body() updateProjectDto: UpdateProjectDto): Promise<ResponseRO> {
    const project = await this.projectService.findOne(updateProjectDto.id)
    if (!project) {
      return { success: false, statusCode: 200, message: '项目不存在' }
    }

    const res = await this.projectService.update(updateProjectDto)
    return {
      success: true,
      statusCode: 200,
      message: '更新成功',
      data: res,
    }
  }

  // 获取项目列表
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects.' })
  @Get('projects')
  async getProjects(@Query() queryProjectDto: QueryProjectDto, @User() user): Promise<ResponseRO> {
    queryProjectDto.userId = user.id

    const count = await this.projectService.getProjectCount()
    let res = []
    if (queryProjectDto.pageNum && queryProjectDto.pageSize) {
      res = await this.projectService.queryProject(queryProjectDto)
    } else {
      res = await this.projectService.findAll()
    }

    return {
      success: true,
      statusCode: 200,
      message: '查询成功',
      data: {
        total: count,

        records: res,
      },
    }
  }
}
