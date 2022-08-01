import { Controller, Get, Patch, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { AppStatsService } from './app-stats.service'
import { AppUserService } from 'src/app-system/app-user/app-user.service'
import { UpushyLogService } from 'src/app-upushy/upushy-log/upushy-log.service'
import { dayjs } from 'src/app-shared/utils'
import { BaseResult } from 'src/app-shared/interface'
import { ApiResponseConstant } from 'src/app-shared/constant'

@ApiBearerAuth()
@ApiTags('系统模块 - 系统统计数据')
@Controller('system/stats')
export class AppStatsController {
  constructor(
    private readonly appStatsService: AppStatsService,
    private readonly appUserService: AppUserService,
    private readonly upushyLogService: UpushyLogService
  ) {}

  // 获取指定时间段内每天的登录次数
  @ApiOperation({ summary: '获取指定时间段内每天的登录次数' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get('login-log')
  async onGetLoginLogStats(): Promise<BaseResult> {
    // const statsTimes = await this.upushyLogService.onFindLoginLogCountByDuration()
    const statsRecords = await this.upushyLogService.onFindLoginLogByDays()
    return {
      statusCode: 200,
      message: '成功',
      data: statsRecords,
    }
  }

  // 获取指定时间段内每天的检查更新次数
  // async onGet

  // 获取系统内用户个数
}
