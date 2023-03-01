/**
 * 基础模块控制器
 * @author: SunSeekerX
 * @Date: 2021-09-13 23:30:57
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:24:43
 */

import { Body, Controller, Get, Post, UseInterceptors, HttpException, HttpStatus } from '@nestjs/common'
import * as OSS from 'ali-oss'
import { ApiOperation, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'

import { getEnv } from 'src/app-shared/config'
import { BaseResult } from 'src/app-shared/interface'
import { UpdateAppDto } from './dto'
import { UpushyProjectService } from 'src/app-upushy/upushy-project/upushy-project.service'
import { UpushySourceService } from 'src/app-upushy/upushy-source/upushy-source.service'
import { UpdateInterceptor } from 'src/app-shared/interceptor'
import { ApiResponseConstant } from 'src/app-shared/constant'

const sts = new OSS.STS({
  accessKeyId: getEnv('ALIYUN_RAM_ACCESS_KEY_ID'),
  accessKeySecret: getEnv('ALIYUN_RAM_ACCESS_KEY_SECRET'),
})

@ApiBearerAuth()
@ApiTags('业务模块 - 基础接口')
@Controller('upushy/basic')
export class UpushyBasicController {
  constructor(
    private readonly upushyProjectService: UpushyProjectService,
    private readonly upushySourceService: UpushySourceService
  ) {}
  /**
   * OSS授权临时访问
   * 接口调用有限制，每1S最多100QPS
   * https://help.aliyun.com/document_detail/32077.htm?spm=a2c4g.11186623.2.25.5a1c606c8MMGGB#title-sdv-594-iub
   */
  @ApiOperation({ summary: 'OSS授权临时访问' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get('oss-sts')
  async assumeRole(): Promise<BaseResult> {
    if (getEnv('SERVER_WEB_OSS')) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
    }
    try {
      const token = await sts.assumeRole(
        `acs:ram::${getEnv('ALIYUN_ACCOUNT_ID')}:role/${getEnv('ALIYUN_ACCOUNT_RAM_ROLE')}`,
        {
          Statement: [
            {
              Action: ['oss:PutObject'],
              Effect: 'Allow',
              Resource: [`acs:oss:*:*:${getEnv('ALIYUN_OSS_BUCKET')}/*`, `acs:oss:*:*:${getEnv('ALIYUN_OSS_BUCKET')}`],
            },
          ],
          Version: '1',
        },
        getEnv<number>('ALIYUN_RAM_TEMPORARY_EXPIRE') * 60,
        ''
      )

      return {
        statusCode: 200,
        message: '成功',
        data: {
          ...token.credentials,
          region: getEnv('ALIYUN_OSS_ENDPOINT'),
          bucket: getEnv('ALIYUN_OSS_BUCKET'),
        },
      }
    } catch (e) {
      return {
        statusCode: e.status,
        message: e.message,
      }
    }
  }

  // 检查更新
  @ApiOperation({ summary: 'App 检查更新' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Post('/update')
  @UseInterceptors(UpdateInterceptor)
  async update(
    @Body()
    { projectId, platform }: UpdateAppDto
  ): Promise<BaseResult> {
    // 根据appid检查项目是否存在
    const project = await this.upushyProjectService.onFindProjectOne(projectId)
    if (!project) {
      return {
        statusCode: 200,
        message: '项目不存在',
      }
    }

    const OSS_BASE_URL = `https://${getEnv('ALIYUN_OSS_BUCKET')}.${getEnv('ALIYUN_OSS_ENDPOINT')}.aliyuncs.com`

    // 资源类型
    let type = 1
    if (platform !== 'android') {
      type = 2
    }

    // 检查原生 Android 更新
    const wgt = await this.upushySourceService.onFindMaxSource({
      projectId: projectId,
      type,
      status: 1,
    })
    wgt && Object.assign(wgt, { url: `${OSS_BASE_URL}/${wgt.url}` })

    const native = await this.upushySourceService.onFindMaxSource({
      projectId: projectId,
      type: type + 2,
      status: 1,
    })
    native && native.type !== 4 && Object.assign(native, { url: `${OSS_BASE_URL}/${native.url}` })

    // 存入redis

    return {
      statusCode: 200,
      message: '成功',
      data: {
        wgt,
        native,
      },
    }
  }
}
