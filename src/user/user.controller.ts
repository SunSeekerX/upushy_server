/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:08:25
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 17:22:47
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Logger,
  Req,
  Ip,
  UseInterceptors,
} from '@nestjs/common'
import { Request } from 'express'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { RedisService } from 'nestjs-redis'
import * as argon2 from 'argon2'
import * as svgCaptcha from 'svg-captcha'

import { ResponseRO } from 'src/shared/interface/response.interface'
import { LoggingInterceptor } from 'src/shared/interceptor/logging.interceptor'
import { LoginUserDto, CreateUserDto } from './dto/index'
import { UserService } from './user.service'
import { guid } from 'src/shared/utils/index'

@ApiBearerAuth()
@ApiTags('users')
@Controller('user')
export class UserController {
  constructor(
    private readonly redisService: RedisService,
    private readonly userService: UserService,
  ) {}

  // 注册图片验证码
  @ApiOperation({ summary: '注册图片验证码' })
  @Get('/register/captcha')
  async registerCodeImg(): Promise<ResponseRO> {
    const captcha = svgCaptcha.create({
      ignoreChars: '0o1i',
      noise: 1,
      color: true,
    })

    const captchaKey = guid()
    try {
      const client = await this.redisService.getClient()
      await client.set(
        `imgCaptcha:register:${captchaKey}`,
        captcha.text.toLowerCase(),
        'ex',
        60,
      )

      return {
        success: true,
        statusCode: 200,
        message: '获取验证码成功',
        data: {
          img: captcha.data,
          uuid: captchaKey,
        },
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: '获取验证码失败',
        errors: [error.message],
      }
    }
  }

  // 注册
  @ApiOperation({ summary: '用户注册' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<ResponseRO> {
    if (!createUserDto.imgCaptcha) {
      return {
        success: false,
        statusCode: 400,
        message: '非法请求',
      }
    }

    try {
      const client = await this.redisService.getClient()
      const captchaText = await client.get(
        `imgCaptcha:register:${createUserDto.imgCaptchaKey}`,
      )

      if (captchaText === createUserDto.imgCaptcha) {
        const user = await this.userService.create(createUserDto)

        if (user) {
          return {
            success: true,
            statusCode: 200,
            message: '注册成功，请登录',
            data: user,
          }
        }
      } else {
        return {
          success: false,
          statusCode: 400,
          message: '验证码错误',
        }
      }
    } catch (error) {
      Logger.error(error.message)

      return {
        success: false,
        statusCode: 400,
        message: '验证码已失效',
      }
    }
  }

  // 登录
  @ApiOperation({ summary: '用户登录' })
  @HttpCode(200)
  @Post('/login')
  @UseInterceptors(LoggingInterceptor)
  async login(
    @Req() request: Request,
    @Ip() ip,
    @Body() loginUserDto: LoginUserDto,
  ): Promise<ResponseRO> {
    if (!loginUserDto.loginCaptchaKey) {
      return {
        success: false,
        statusCode: 400,
        message: '非法请求',
      }
    }

    // 记录登录日志
    // 登录状态（0成功 1失败）
    // let loginStatus = '1'
    // // 用户名
    // const { username } = loginUserDto
    // const browser = `${request.useragent.browser}:${request.useragent.version}`
    // console.log(await getIPLocation('47.102.131.123'))
    // console.log({ username, request, ip })

    try {
      const client = await this.redisService.getClient()
      const loginCaptchaText = await client.get(
        `imgCaptcha:login:${loginUserDto.loginCaptchaKey}`,
      )
      if (!loginCaptchaText) {
        return {
          success: false,
          statusCode: 400,
          message: '验证码已失效',
        }
      }

      if (loginCaptchaText === loginUserDto.imgCaptcha) {
        const _user = await this.userService.findOne(loginUserDto)

        if (!_user) {
          return {
            statusCode: 200,
            success: false,
            message: `${loginUserDto.username}不存在`,
          }
        }
        // 检查密码
        if (await argon2.verify(_user.password, loginUserDto.password)) {
          const token = await this.userService.generateJWT(_user)
          const { username, nickname } = _user
          const user = { token, username, nickname }

          return {
            success: true,
            statusCode: 200,
            message: '登录成功',
            data: {
              token: user.token,
              userInfo: {
                username: user.username,
                nickname: user.nickname,
              },
            },
          }
        } else {
          return { success: false, statusCode: 200, message: '密码错误' }
        }
      } else {
        return {
          success: false,
          statusCode: 400,
          message: '验证码错误',
        }
      }
    } catch (error) {
      Logger.error(error.message)
      return {
        success: false,
        statusCode: 400,
        message: '登录失败',
        errors: error.message,
      }
    }
  }

  // 登录图片验证码
  @ApiOperation({ summary: '登录验证码' })
  @Get('/login/captcha')
  async loginCodeImg(): Promise<ResponseRO> {
    const captcha = svgCaptcha.create({
      ignoreChars: '0o1i',
      noise: 1,
      color: true,
    })

    const captchaKey = guid()
    try {
      const client = await this.redisService.getClient()
      await client.set(
        `imgCaptcha:login:${captchaKey}`,
        captcha.text.toLowerCase(),
        'ex',
        60,
      )

      return {
        success: true,
        statusCode: 200,
        message: '获取验证码成功',
        data: {
          img: captcha.data,
          uuid: captchaKey,
        },
      }
    } catch (error) {
      return {
        success: false,
        statusCode: 400,
        message: '获取验证码失败',
        errors: [error.message],
      }
    }
  }
}
