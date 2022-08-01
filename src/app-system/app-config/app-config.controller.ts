import { Controller, Get, Patch, Body } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { isNil } from 'lodash'

import { AppConfigService } from './app-config.service'
import { ApiResponseConstant } from 'src/app-shared/constant'
import { BaseResult } from 'src/app-shared/interface'
import { IS_ENABLE_REGISTER, IS_USER_VIEW_LOGIN_LOG } from 'src/app-shared/config/default'
import { AppConfig } from 'src/app-shared/enums'
import { ModifyAppConfigDto } from './dto'
import { RequestUser } from 'src/app-shared/decorator/request-user.decorator'
import type { UserEntity } from 'src/app-system/app-user/entities'

@ApiBearerAuth()
@ApiTags('系统模块 - 系统配置')
@Controller('system/config')
export class AppConfigController {
  constructor(private readonly appConfigService: AppConfigService) {}

  // 获取系统配置
  @ApiOperation({ summary: '获取系统配置' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get()
  async onGetAppConfig(): Promise<BaseResult> {
    const allConfigs = await this.appConfigService.onFindAppConfigAll()
    const configs = {
      [AppConfig.isEnableRegister]: IS_ENABLE_REGISTER,
      [AppConfig.isUserViewLoginLog]: IS_USER_VIEW_LOGIN_LOG,
      serviceTime: new Date().getTime(),
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
  @Patch()
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
}
