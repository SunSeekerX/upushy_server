/**
 * 基础模块控制器
 * @author: SunSeekerX
 * @Date: 2021-09-13 23:30:57
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:24:43
 */

import { Body, Controller, Get, HttpCode, Post, UseInterceptors, HttpStatus } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'
import { BaseResult } from 'src/shared/interface/response.interface'
import { UpdateAppDto } from 'src/basic/dto/index'
import { ProjectService } from 'src/project/project.service'
import { SourceService } from 'src/source/source.service'
import { UpdateInterceptor } from 'src/shared/interceptor'

@ApiBearerAuth()
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly projectService: ProjectService, private readonly sourceService: SourceService) {}

  // 检查更新
  @ApiOperation({ summary: '检查更新' })
  @HttpCode(200)
  @Post('update')
  @UseInterceptors(UpdateInterceptor)
  async update(
    @Body()
    { projectId, platform }: UpdateAppDto
  ): Promise<BaseResult> {
    // 根据appid检查项目是否存在
    const project = await this.projectService.findOne(projectId)
    if (!project) {
      return {
        statusCode: 200,
        message: '项目不存在',
      }
    }

    const OSS_BASE_URL = `https://${getEnv('ALIYUN_OSS_BUCKET', EnvType.string)}.${getEnv(
      'ALIYUN_OSS_ENDPOINT',
      EnvType.string
    )}.aliyuncs.com`

    // 资源类型
    let type = 1
    if (platform !== 'android') {
      type = 2
    }

    // 检查原生 Android 更新
    const wgt = await this.sourceService.queryMaxSource({
      projectId: projectId,
      type,
      status: 1,
    })
    wgt && Object.assign(wgt, { url: `${OSS_BASE_URL}/${wgt.url}` })

    const native = await this.sourceService.queryMaxSource({
      projectId: projectId,
      type: type + 2,
      status: 1,
    })
    native && native.type !== 4 && Object.assign(native, { url: `${OSS_BASE_URL}/${native.url}` })

    // 存入redis

    return {
      success: true,
      statusCode: 200,
      message: '成功',
      data: {
        wgt,
        native,
      },
    }
  }
}
