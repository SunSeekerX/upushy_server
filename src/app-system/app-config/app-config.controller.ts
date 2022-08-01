import { Controller, Get, Patch, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { isNil } from 'lodash'
import * as os from 'os'
import * as v8 from 'v8'
import * as publicIp from 'public-ip'
import * as internalIp from 'internal-ip'
import * as OSS from 'ali-oss'
import * as nodeDiskInfo from 'node-disk-info'

import { AppConfigService } from './app-config.service'
import { getEnv } from 'src/app-shared/config'
import { ApiResponseConstant } from 'src/app-shared/constant'
import { BaseResult } from 'src/app-shared/interface'
import { IS_ENABLE_REGISTER, IS_USER_VIEW_LOGIN_LOG } from 'src/app-shared/config/default'
import { AppConfig } from 'src/app-shared/enums'
import { ModifyAppConfigDto } from './dto'
import { RequestUser } from 'src/app-shared/decorator/request-user.decorator'
import type { UserEntity } from 'src/app-system/app-user/entities'

@ApiBearerAuth()
@ApiTags('系统模块 - 系统配置')
@Controller('/system')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  // 获取系统配置
  @ApiOperation({ summary: '获取系统配置' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get('/config')
  async onGetAppConfig(): Promise<BaseResult> {
    const allConfigs = await this.appConfigService.onFindAppConfigAll()
    const configs = {
      [AppConfig.isEnableRegister]: IS_ENABLE_REGISTER,
      [AppConfig.isUserViewLoginLog]: IS_USER_VIEW_LOGIN_LOG,
      serviceTime: new Date().getTime(),
      updateUrlSuffix: `${getEnv<string>('API_GLOBAL_PREFIX')}/basic/update`,
    }
    for (const item of allConfigs) {
      if (!isNil(item)) {
        configs[item.configKey] = item.configValue
      }
    }
    return {
      statusCode: 200,
      message: '成功',
      data: configs,
    }
  }

  // 修改系统配置
  @ApiOperation({ summary: '更新系统配置' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Patch('/config')
  async onUpdateAppConfig(
    @RequestUser() requestUser: UserEntity,
    @Body() modifyConfigDto: ModifyAppConfigDto
  ): Promise<BaseResult> {
    const findAppConfig = await this.appConfigService.onFindAppConfigByKey(modifyConfigDto.configKey)
    if (isNil(findAppConfig)) {
      // 不存在写入到数据库
      const createAppConfigRes = await this.appConfigService.onCreateAppConfig(requestUser, modifyConfigDto)
      return {
        statusCode: 200,
        message: '成功',
        data: createAppConfigRes,
      }
    } else {
      const updateAppConfigRes = await this.appConfigService.onUpdateAppConfig(requestUser, modifyConfigDto)
      return {
        statusCode: 200,
        message: '成功',
        data: updateAppConfigRes,
      }
    }
  }

  // 系统信息
  @ApiOperation({ summary: '获取系统信息' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get('/info')
  async getSystemConfig(): Promise<BaseResult> {
    try {
      const disks = await nodeDiskInfo.getDiskInfo()
      const publicIpIpv4 = await publicIp.v4()
      const internalIpIpv4 = await internalIp.v4()

      return {
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
        statusCode: 500,
        message: error.message,
      }
    }
  }
}
