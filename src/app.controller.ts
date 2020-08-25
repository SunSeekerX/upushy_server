/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 22:33:39
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-25 15:38:22
 */

import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  Body,
  Query,
} from '@nestjs/common'
// import { FileInterceptor } from '@nestjs/platform-express'
// import { AlicloudOssService, UploadedFileMetadata } from 'nestjs-alicloud-oss'
import { RedisService } from 'nestjs-redis'
const OSS = require('ali-oss')

import { ApiResponse, ApiOperation, ApiTags } from '@nestjs/swagger'

import { ResponseRO } from 'src/shared/interface/response.interface'
// import { guid } from 'src/shared/utils/index'
import { UpdateAppDto } from './dto/index'
import { ProjectService } from './project/project.service'
import { SourceService } from './source/source.service'

const sts = new OSS.STS({
  accessKeyId: process.env.ALIYUN_RAM_ACCESSKEYID,
  accessKeySecret: process.env.ALIYUN_RAM_ACCESSKEYSECRET,
})

@ApiTags('Common')
@Controller()
export class AppController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly sourceService: SourceService,
    // private readonly ossService: AlicloudOssService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  getHello(): ResponseRO {
    return {
      success: true,
      statusCode: 200,
      message: 'Hello world.',
    }
  }

  /**
   * @description OSS授权临时访问
   * 接口调用有限制，每1S最多100QPS
   */
  @ApiOperation({ summary: 'OSS授权临时访问' })
  @Get('oss-sts')
  async assumeRole(): Promise<ResponseRO> {
    try {
      const token = await sts.assumeRole(
        process.env.ALIYUN_RAM_ARN,
        // 'acs:ram::1501092948750966:role/webossuploadrole',
        {
          Statement: [
            {
              Action: ['oss:PutObject'],
              Effect: 'Allow',
              Resource: [
                `acs:oss:*:*:${process.env.OSS_BUCKET}/*`,
                `acs:oss:*:*:${process.env.OSS_BUCKET}`,
              ],
            },
          ],
          Version: '1',
        },
        Number(process.env.ALIYUN_RAM_TEMPORARY_EXPIRE) * 60,
        '',
      )

      return {
        success: true,
        statusCode: 200,
        message: '成功',
        data: {
          ...token.credentials,
          region: process.env.OSS_REGION,
          bucket: process.env.OSS_BUCKET,
        },
      }
    } catch (e) {
      console.log(e)
      return {
        success: false,
        statusCode: e.status,
        message: e.message,
      }
    }
  }

  // 文件上传
  // @ApiOperation({ summary: 'oss文件上传' })
  // @ApiResponse({ status: 201, description: 'Upload file successful.' })
  // @UseInterceptors(FileInterceptor('file'))
  // @Post('upload')
  // async uploadedFile(
  //   @UploadedFile()
  //   file: UploadedFileMetadata,
  // ): Promise<ResponseRO> {
  //   file = {
  //     ...file,
  //     customName: `${guid()}.${file.originalname}`,
  //     // folder: 'a/b/c',
  //     // bucket: 'nest-alicloud-oss-demo3',
  //   }

  //   await this.ossService.upload(file)

  //   if (file) {
  //     return {
  //       success: true,
  //       statusCode: 200,
  //       message: '上传成功',
  //       data: file,
  //     }
  //   } else {
  //     return {
  //       success: false,
  //       statusCode: 200,
  //       message: '上传失败',
  //     }
  //   }
  // }

  // 检查更新
  @ApiOperation({ summary: '检查更新' })
  @HttpCode(200)
  @Get('update')
  async update(
    @Query()
    { projectId, platform, versionCode, nativeVersionCode }: UpdateAppDto,
  ): Promise<ResponseRO> {
    // 根据appid检查项目是否存在
    const project = await this.projectService.findOne(projectId)
    if (!project) {
      return {
        success: false,
        statusCode: 200,
        message: '项目不存在',
      }
    }

    const OSS_BASE_URL = process.env.OSS_BASE_URL

    // 资源类型
    let type: number = 1
    if (platform !== 'android') {
      type = 2
    }

    // 检查原生Andtoid更新
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
    native &&
      native.type !== 4 &&
      Object.assign(native, { url: `${OSS_BASE_URL}/${native.url}` })

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

    // if (platform === 'android') {
    //   // 检查原生Andtoid更新
    //   const wgt = await this.sourceService.queryMaxSource({
    //     projectId: projectId,
    //     type: 1,
    //   })
    //   wgt && Object.assign(wgt, { url: `${OSS_BASE_URL}/${wgt.url}` })

    //   const native = await this.sourceService.queryMaxSource({
    //     projectId: projectId,
    //     type: 3,
    //   })
    //   native && Object.assign(native, { url: `${OSS_BASE_URL}/${native.url}` })

    //   // 存入redis

    //   return {
    //     success: true,
    //     statusCode: 200,
    //     message: '成功',
    //     data: {
    //       wgt,
    //       native,
    //     },
    //   }
    //   // return await this.checkNativeUpdate({
    //   //   projectId: project.id,
    //   //   type: 3,
    //   //   versionCode,
    //   //   nativeVersionCode,
    //   // })
    // } else {
    //   // 检查原生IOS更新
    //   const wgt = await this.sourceService.queryMaxSource({
    //     projectId: projectId,
    //     type: 2,
    //   })

    //   const native = await this.sourceService.queryMaxSource({
    //     projectId: projectId,
    //     type: 4,
    //   })

    //   // 存入redis
    //   return {
    //     success: true,
    //     statusCode: 200,
    //     message: '成功',
    //     data: {
    //       wgt,
    //       native,
    //     },
    //   }
    //   // return await this.checkNativeUpdate({
    //   //   projectId: project.id,
    //   //   type: 4,
    //   //   versionCode,
    //   //   nativeVersionCode,
    //   // })
    // }
  }

  // 系统信息
  @ApiOperation({ summary: '获取系统信息' })
  @HttpCode(200)
  @Get('config')
  async getConfig(): Promise<ResponseRO> {
    return {
      success: true,
      statusCode: 200,
      message: '成功',
      data: {
        serviceTime: new Date().getTime(),
      },
    }
  }
}
