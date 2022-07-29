/**
 * 基础模块控制器
 * @author: SunSeekerX
 * @Date: 2021-09-13 23:30:57
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:24:43
 */

import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'

import { BaseResult } from 'src/app-shared/interface'
import { ApiResponseConstant } from 'src/app-shared/constant'

@ApiBearerAuth()
@ApiTags('系统模块 - 基础接口')
@Controller()
export class AppController {
  constructor() {}

  @ApiOperation({ summary: 'Hello world!' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get('/')
  onGet(): BaseResult {
    return {
      statusCode: 200,
      message: '成功',
      data: {
        msg: 'Hello world!',
        timestamp: new Date().getTime(),
      },
    }
  }
}
