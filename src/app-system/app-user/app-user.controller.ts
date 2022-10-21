/**
 * 用户控制器
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:08:25
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 20:52:38
 */

import { Controller, Post, Body, Patch, Get, Logger, UseInterceptors, HttpStatus } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { verify } from 'jsonwebtoken'
import * as argon2 from 'argon2'
import * as svgCaptcha from 'svg-captcha'
import * as svg64 from 'svg64'

import { BaseResult } from 'src/app-shared/interface'
import { UpdateUserDto, UpdateUserPasswordDto } from './dto'
import { AppAuthService } from 'src/app-system/app-auth/app-auth.service'
import { AppUserService } from './app-user.service'
import { RequestUser } from 'src/app-shared/decorator/request-user.decorator'
import type { UserEntity } from 'src/app-system/app-user/entities'
import { AppCacheService } from 'src/app-system/app-cache/app-cache.service'
import { ApiResponseConstant } from 'src/app-shared/constant'

@ApiBearerAuth()
@ApiTags('系统模块 - 用户管理')
@Controller('/system/user')
export class AppUserController {
  constructor(private readonly appUserService: AppUserService, private readonly appAuthService: AppAuthService) {}
  // 更新用户信息
  @ApiOperation({ summary: '更新用户信息' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Patch()
  async onUpdateUser(
    @Body() updateUserDto: UpdateUserDto,
    @RequestUser() requestUser: UserEntity
  ): Promise<BaseResult> {
    const res = await this.appUserService.onUpdateUser(requestUser.id, updateUserDto)
    if (res.affected === 1) {
      const newUser = await this.appUserService.onFindUserOneById(requestUser.id)
      return {
        statusCode: 200,
        message: '修改成功',
        data: newUser,
      }
    } else {
      return {
        statusCode: 500,
        message: '修改失败',
      }
    }
  }

  // 修改密码
  @ApiOperation({ summary: '修改密码' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Patch('/password')
  async onChangePwd(
    @Body() updateUserPasswordDto: UpdateUserPasswordDto,
    @RequestUser() requestUser: UserEntity
  ): Promise<BaseResult> {
    const password = updateUserPasswordDto.password
    try {
      // 验证密码是否正确
      const flag = await argon2.verify(requestUser.password, password)
      if (!flag) {
        return {
          statusCode: 400,
          message: '密码错误',
        }
      }
      const hashPassword = await argon2.hash(updateUserPasswordDto.newPassword)
      const res = await this.appUserService.onUpdateUser(requestUser.id, {
        password: hashPassword,
        updatedPwdTime: new Date(),
      })
      if (res.affected === 1) {
        return {
          statusCode: 200,
          message: '修改密码成功',
        }
      } else {
        return {
          statusCode: 500,
          message: '修改失败',
        }
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: '密码错误',
      }
    }
  }

  // 获取用户信息
  @ApiOperation({ summary: '获取用户信息' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get()
  async onGetUserInfo(@RequestUser() requestUser: UserEntity): Promise<BaseResult> {
    const findUser = await this.appUserService.onFindUserOneById(requestUser.id)
    const findUserPermission = await this.appAuthService.onFindUserPermissionByUserId(requestUser.id)
    return {
      statusCode: 200,
      message: '成功',
      data: {
        username: findUser.username,
        nickname: findUser.nickname,
        permission: findUserPermission?.permission || null,
      },
    }
  }
}
