/**
 * 日志控制器
 * @author: SunSeekerX
 * @Date: 2020-11-03 10:27:59
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:20:49
 */

import { Controller, Get, Query } from '@nestjs/common'

import { ApiResponse, ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger'

import { UpushyLogService } from './upushy-log.service'

import { QueryLoginLogDto } from './dto'
import { BaseResult } from 'src/app-shared/interface'

@ApiBearerAuth()
@ApiTags('业务模块 - 日志管理')
@Controller('log')
export class UpushyLogController {
  constructor(private readonly upushyLogService: UpushyLogService) {}

  // 获取登录日志
  @ApiOperation({ summary: '获取登录日志' })
  @ApiResponse({ status: 200, description: '获取成功' })
  @Get('login')
  async onFindLoginLogs(@Query() queryLoginLogDto: QueryLoginLogDto): Promise<BaseResult> {
    const count = await this.upushyLogService.onFindLoginLogCount()
    let res = []
    const orderCondition = {}
    queryLoginLogDto.sortKey && (orderCondition[queryLoginLogDto.sortKey] = queryLoginLogDto.order)

    if (queryLoginLogDto.pageNum && queryLoginLogDto.pageSize) {
      res = await this.upushyLogService.onFindLoginLogPaging(queryLoginLogDto, orderCondition)
    } else {
      res = await this.upushyLogService.onFindLoginLogAll()
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
