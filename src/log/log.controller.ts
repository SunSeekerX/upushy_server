/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-11-03 10:27:59
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-03 13:28:17
 */

import { Controller, Get, Query } from '@nestjs/common'

import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger'

import { LogService } from './log.service'

import { QueryLoginLogDto } from './dto/index'
import { ResponseRO } from 'src/shared/interface/response.interface'

@ApiBearerAuth()
@ApiTags('Log')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  // 获取登录日志
  @ApiOperation({ summary: '获取登录日志' })
  @ApiResponse({ status: 200, description: '获取成功.' })
  @Get('login')
  async getLoginLogs(
    @Query() queryLoginLogDto: QueryLoginLogDto,
  ): Promise<ResponseRO> {
    const count = await this.logService.getLoginLogCount()
    let res = []
    const orderCondition = {}
    queryLoginLogDto.sortKey &&
      (orderCondition[queryLoginLogDto.sortKey] = queryLoginLogDto.order)

    if (queryLoginLogDto.pageNum && queryLoginLogDto.pageSize) {
      res = await this.logService.queryLoginLog(
        queryLoginLogDto,
        orderCondition,
      )
    } else {
      res = await this.logService.findAllLoginLog()
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
