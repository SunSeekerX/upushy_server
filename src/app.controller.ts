/**
 * @name: 应用控制器
 * @author: SunSeekerX
 * @Date: 2020-06-25 22:33:39
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-10 17:13:51
 */

import { Body, Controller, Get, HttpCode, Post, UseInterceptors } from '@nestjs/common'
import * as os from 'os'
import * as v8 from 'v8'
import * as publicIp from 'public-ip'
import * as internalIp from 'internal-ip'
import * as OSS from 'ali-oss'
import * as nodeDiskInfo from 'node-disk-info'

import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { getEnv } from 'src/shared/utils/env'
import { EnvType } from 'src/shared/interface/env-type.interface'
import { ResponseRO } from 'src/shared/interface/response.interface'
import { UpdateAppDto } from './dto/index'
import { ProjectService } from './project/project.service'
import { SourceService } from './source/source.service'
import { UpdateInterceptor } from './shared/interceptor/update.interceptor'
import { HttpException } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common'

const sts = new OSS.STS({
  accessKeyId: getEnv('ALIYUN_RAM_ACCESS_KEY_ID', EnvType.string),
  accessKeySecret: getEnv('ALIYUN_RAM_ACCESS_KEY_SECRET', EnvType.string),
})

@ApiTags('Basic')
@Controller()
export class AppController {
  constructor(private readonly projectService: ProjectService, private readonly sourceService: SourceService) {}

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
   * https://help.aliyun.com/document_detail/32077.htm?spm=a2c4g.11186623.2.25.5a1c606c8MMGGB#title-sdv-594-iub
   */
  @ApiOperation({ summary: 'OSS授权临时访问' })
  @Get('oss-sts')
  async assumeRole(): Promise<ResponseRO> {
    if (!getEnv('WEB_OSS', EnvType.boolean)) {
      try {
        const token = await sts.assumeRole(
          `acs:ram::${getEnv('ALIYUN_ACCOUNT_ID', EnvType.string)}:role/${getEnv(
            'ALIYUN_ACCOUNT_RAM_ROLE',
            EnvType.string
          )}`,
          {
            Statement: [
              {
                Action: ['oss:PutObject'],
                Effect: 'Allow',
                Resource: [
                  `acs:oss:*:*:${getEnv('ALIYUN_OSS_BUCKET', EnvType.string)}/*`,
                  `acs:oss:*:*:${getEnv('ALIYUN_OSS_BUCKET', EnvType.string)}`,
                ],
              },
            ],
            Version: '1',
          },
          Number(getEnv('ALIYUN_RAM_TEMPORARY_EXPIRE', EnvType.number)) * 60,
          ''
        )

        return {
          success: true,
          statusCode: 200,
          message: '成功',
          data: {
            ...token.credentials,
            region: getEnv('ALIYUN_OSS_ENDPOINT', EnvType.string),
            bucket: getEnv('ALIYUN_OSS_BUCKET', EnvType.string),
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
    } else {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
    }
  }

  // 检查更新
  @ApiOperation({ summary: '检查更新' })
  @HttpCode(200)
  @Post('update')
  @UseInterceptors(UpdateInterceptor)
  async update(
    @Body()
    { projectId, platform }: UpdateAppDto
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

  // 系统配置
  @ApiOperation({ summary: '获取系统配置' })
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

  // 系统信息
  @ApiOperation({ summary: '获取系统信息' })
  @HttpCode(200)
  @Get('config/system')
  async getSystemConfig(): Promise<ResponseRO> {
    try {
      const disks = await nodeDiskInfo.getDiskInfo()
      const publicIpIpv4 = await publicIp.v4()
      const internalIpIpv4 = await internalIp.v4()

      return {
        success: true,
        statusCode: 200,
        message: '成功',
        data: {
          serviceTime: new Date().getTime(),
          os: {
            // 系统架构
            arch: os.arch(),
            cpus: os.cpus(),
            // 以整数的形式返回空闲的系统内存量（以字节为单位）。
            freemem: os.freemem(),
            // 以整数的形式返回系统的内存总量（以字节为单位）。
            totalmem: os.totalmem(),
            // 以字符串的形式返回操作系统的主机名。
            hostname: os.hostname(),
            /**
           * 返回一个数组，包含 1、5 和 15 分钟的平均负载。

平均负载是系统活动性的测量，由操作系统计算得出，并表现为一个分数。

平均负载是 UNIX 特定的概念。 在 Windows 上，其返回值始终为 [0, 0, 0]。
           */
            loadavg: os.loadavg(),
            // 在 Linux 上返回 'Linux'，在 macOS 上返回 'Darwin'，在 Windows 上返回 'Windows_NT'。
            type: os.type(),
            // 系统正常运行的时间
            uptime: os.uptime(),
            // 主机公网地址
            publicIpIpv4,
            // 主机内网地址
            internalIpIpv4,
            // 返回当前用户的主目录的字符串路径。
            homedir: os.homedir(),
          },
          process: {
            // 项目路径
            cwd: process.cwd(),
            execPath: process.execPath,
            versions: process.versions,
            // 该返回值包含秒的分数。 使用 Math.floor() 来得到整秒钟。
            uptime: Math.floor(process.uptime()),
            // env: process.env,
            // 返回 Node.js 进程的内存使用情况的对象，该对象每个属性值的单位为字节。
            // memoryUsage: process.memoryUsage(),
          },
          v8: {
            // getHeapSpaceStatistics: v8.getHeapSpaceStatistics(),
            // v8 引擎堆内存占用
            getHeapStatistics: v8.getHeapStatistics(),
          },
          disks,
        },
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 500,
        message: error.message,
      }
    }
  }
}
