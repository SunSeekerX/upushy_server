import { Controller, Get } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'

import { AppConfigService } from './app-config.service'
import { ApiResponseConstant } from 'src/app-shared/constant'
import { BaseResult } from 'src/app-shared/interface'

@ApiBearerAuth()
@ApiTags('系统模块 - 系统配置')
@Controller('app-system/app-config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  // 获取系统配置
  @ApiOperation({ summary: '获取系统配置' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get()
  async onGetSystemConfig(): Promise<BaseResult> {
    return {
      statusCode: 200,
      message: '成功',
    }
  }
}
