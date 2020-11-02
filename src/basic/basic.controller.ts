/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 11:41:08
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 14:38:58
 */

import { Controller, Get, Query } from '@nestjs/common'
import { BasicService } from './basic.service'
import { QueryLoginLogDto } from './dto/query-login-log.dto'

import {
  ApiResponse,
  ApiOperation,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger'
import { ResponseRO } from 'src/shared/interface/response.interface'
@ApiBearerAuth()
@ApiTags('Basic')
@Controller('basic')
export class BasicController {
  constructor(private readonly basicService: BasicService) {}

  // 获取登录日志
  @ApiOperation({ summary: '获取登录日志' })
  @ApiResponse({ status: 200, description: '获取成功.' })
  @Get('loginLog')
  async getLoginLogs(
    @Query() queryLoginLogDto: QueryLoginLogDto,
  ): Promise<ResponseRO> {
    const count = await this.basicService.getLoginLogCount()
    let res = []
    const orderCondition = {}
    queryLoginLogDto.sortKey &&
      (orderCondition[queryLoginLogDto.sortKey] = queryLoginLogDto.order)
    // if (queryLoginLogDto.sortKey) {
    //   orderCondition = {
    //     [queryLoginLogDto.sortKey]: queryLoginLogDto.order,
    //   }
    // }
    if (queryLoginLogDto.pageNum && queryLoginLogDto.pageSize) {
      res = await this.basicService.queryLoginLog(
        queryLoginLogDto,
        orderCondition,
      )
    } else {
      res = await this.basicService.findAllLoginLog()
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
