import { Controller, Post, Body, Patch, Get, Logger, UseInterceptors, HttpStatus, Res, HttpCode } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { verify } from 'jsonwebtoken'
import { isNil } from 'lodash'
import * as argon2 from 'argon2'
import * as svgCaptcha from 'svg-captcha'
import * as svg64 from 'svg64'
import type { Response } from 'express'

import { LoginUserDto, RefreshTokenDto } from './dto'
import { AppAuthService } from './app-auth.service'
import { UserPermission } from 'src/app-shared/enums'
import { CreateUserDto, UpdateUserDto } from 'src/app-system/app-user/dto'
import { genSnowFlakeId } from 'src/app-shared/utils'
import { BaseResult } from 'src/app-shared/interface'
import { LoginInterceptor } from 'src/app-shared/interceptor'
import type { UserEntity } from 'src/app-system/app-user/entities'
import { AppUserService } from 'src/app-system/app-user/app-user.service'
import { getEnv } from 'src/app-shared/config'
import { AppCacheService } from 'src/app-system/app-cache/app-cache.service'
import { ApiResponseConstant } from 'src/app-shared/constant'
import { CreateUserPermissionDto } from './dto/create-user-permission.dto'

@ApiBearerAuth()
@ApiTags('系统模块 - 认证管理')
@Controller('system/auth')
export class AppAuthController {
  constructor(
    private readonly cacheManager: AppCacheService,
    private readonly appUserService: AppUserService,
    private readonly appAuthService: AppAuthService
  ) {}

  // 注册图片验证码
  @ApiOperation({ summary: '注册图片验证码' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get('/captcha/register')
  async onGetRegisterCodeImg(): Promise<BaseResult> {
    const captcha = svgCaptcha.create({
      ignoreChars: '0o1i',
      noise: 1,
      color: true,
    })

    const captchaKey = genSnowFlakeId()
    try {
      await this.cacheManager.INSTANCE.set(`imgCaptcha:register:${captchaKey}`, captcha.text.toLowerCase(), {
        ttl: 60,
      })
      return {
        statusCode: 200,
        message: '获取验证码成功',
        data: {
          img: svg64(captcha.data),
          uuid: captchaKey,
        },
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: '获取验证码失败',
        errors: [error.message],
      }
    }
  }

  // 注册
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_201)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Post('/register')
  async onCreateUser(@Body() createUserDto: CreateUserDto, @Res() response: Response): Promise<BaseResult> {
    try {
      // 检查验证码是否正确
      const captchaText = await this.cacheManager.INSTANCE.get<string>(
        `imgCaptcha:register:${createUserDto.imgCaptchaKey}`
      )
      if (captchaText !== createUserDto.imgCaptcha) {
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.FORBIDDEN,
          message: '验证码错误',
        })
        return
        // return {
        //   statusCode: HttpStatus.FORBIDDEN,
        //   message: '验证码错误',
        // }
      }
      // 检查用户是否存在
      const findUser = await this.appUserService.onFindUserOne({
        where: {
          username: createUserDto.username,
        },
      })
      console.log(findUser)
      if (!isNil(findUser)) {
        response.status(HttpStatus.BAD_REQUEST).json({
          statusCode: HttpStatus.BAD_REQUEST,
          message: '用户名已存在',
        })
        return
        // return {
        //   statusCode: HttpStatus.BAD_REQUEST,
        //   message: '用户名已存在',
        // }
      }

      const savedUser = await this.appUserService.onCreateUser(createUserDto)
      // 获取用户数量，如果是第一个注册的用户自动成为管理员
      const usersAmount = await this.appUserService.onFindUserAllCount()
      if (usersAmount !== 1) {
        response.status(HttpStatus.CREATED).json({
          statusCode: 200,
          message: '注册成功，请登录',
        })
        return
        // return {
        //   statusCode: 200,
        //   message: '注册成功，请登录',
        // }
      }
      // 写入管理员权限
      const createUserPermissionDto = new CreateUserPermissionDto()
      createUserPermissionDto.permission = UserPermission.Admin
      createUserPermissionDto.userId = savedUser.id
      await this.appAuthService.onCreateUserPermission(createUserPermissionDto)
      response.status(HttpStatus.CREATED).json({
        statusCode: 200,
        message: '注册成功，请登录',
      })
      return
      // return {
      //   statusCode: 200,
      //   message: '注册成功，请登录',
      // }
    } catch (error) {
      Logger.error(error.message)
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: error.message,
      })
      return
      // return {
      //   statusCode: HttpStatus.FORBIDDEN,
      //   message: error.message,
      // }
    }
  }

  // 登录图片验证码
  @ApiOperation({ summary: '登录验证码' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Get('/captcha/login')
  async onGetLoginCodeImg(): Promise<BaseResult> {
    const captcha = svgCaptcha.create({
      ignoreChars: '0o1il',
      noise: 1,
      color: true,
    })

    const captchaKey = genSnowFlakeId()
    try {
      await this.cacheManager.INSTANCE.set(`imgCaptcha:login:${captchaKey}`, captcha.text.toLowerCase(), {
        ttl: 60,
      })

      return {
        statusCode: 200,
        message: '获取验证码成功',
        data: {
          img: svg64(captcha.data),
          uuid: captchaKey,
        },
      }
    } catch (error) {
      return {
        statusCode: 400,
        message: '获取验证码失败',
        errors: [error.message],
      }
    }
  }

  // 登录
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(LoginInterceptor)
  async onLogin(@Body() loginUserDto: LoginUserDto, @Res() response: Response): Promise<BaseResult> {
    if (!loginUserDto.loginCaptchaKey) {
      return this.responseWithHttpStatus(
        HttpStatus.FORBIDDEN,
        {
          statusCode: 400,
          message: '非法请求',
        },
        response
      )
    }

    try {
      const loginCaptchaText = await this.cacheManager.INSTANCE.get(`imgCaptcha:login:${loginUserDto.loginCaptchaKey}`)
      if (!loginCaptchaText) {
        return this.responseWithHttpStatus(
          HttpStatus.BAD_REQUEST,
          {
            statusCode: HttpStatus.BAD_REQUEST,
            message: '验证码已失效',
          },
          response
        )
      }

      if (loginCaptchaText !== loginUserDto.imgCaptcha) {
        return this.responseWithHttpStatus(
          HttpStatus.BAD_REQUEST,
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: '验证码错误',
          },
          response
        )
      }
      const _user = await this.appUserService.onFindUserOne({
        where: {
          username: loginUserDto.username,
        },
      })

      if (!_user) {
        return this.responseWithHttpStatus(
          HttpStatus.BAD_REQUEST,
          {
            statusCode: HttpStatus.NOT_FOUND,
            message: `${loginUserDto.username}不存在`,
          },
          response
        )
      }
      // 检查密码
      const flag = await argon2.verify(_user.password, loginUserDto.password)
      if (!flag) {
        return this.responseWithHttpStatus(
          HttpStatus.BAD_REQUEST,
          { statusCode: HttpStatus.FORBIDDEN, message: '密码错误' },
          response
        )
      }

      const token = this.appUserService.onGenerateJWT(_user)
      const refreshToken = this.appUserService.onGenerateRefreshToken(_user)
      const { id, username, nickname } = _user
      const userInfo = {
        username,
        nickname,
      }
      const userPermission = await this.appAuthService.onFindUserPermissionByUserId(id)
      if (userPermission?.permission) {
        userInfo['permission'] = userPermission.permission
      }
      return this.responseWithHttpStatus(
        HttpStatus.OK,
        {
          statusCode: 200,
          message: '登录成功',
          data: {
            token,
            refreshToken,
            userInfo,
          },
        },
        response
      )
    } catch (error) {
      Logger.error(error.message)
      return this.responseWithHttpStatus(
        HttpStatus.INTERNAL_SERVER_ERROR,
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: '登录失败',
          errors: error.message,
        },
        response
      )
    }
  }

  // 用 refreshToken 获取新的 Token
  @ApiOperation({ summary: '刷新token' })
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_200)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_401)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_403)
  @ApiResponse(ApiResponseConstant.RESPONSE_CODE_500)
  @Post('/token')
  async onRefreshToken(@Body() { refreshToken }: RefreshTokenDto): Promise<BaseResult> {
    try {
      // 解码 refreshToken
      const decoded: any = verify(refreshToken, getEnv<string>('SERVER_JWT_SECRET'))
      // 获取用户
      const user = await this.appUserService.onFindUserOneById(decoded.id)
      // 判断 token 是否有效
      if (new Date(user.updatedPwdTime).getTime() !== new Date(decoded.updatedPwdTime).getTime()) {
        return {
          statusCode: 401,
          message: '登录信息已失效',
        }
      }

      const token = this.appUserService.onGenerateJWT(user)
      return {
        statusCode: 200,
        message: 'Success',
        data: token,
      }
    } catch (error) {
      return {
        statusCode: 401,
        message: 'refreshToken 过期',
        errors: [error.message],
      }
    }
  }

  private responseWithHttpStatus(code: number, responseJson: BaseResult, response: Response) {
    response.status(code).json(responseJson)
    return responseJson
  }
}
