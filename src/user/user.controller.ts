/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:08:25
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-17 10:14:37
 */

import {
  Controller,
  Post,
  Body,
  HttpCode,
  Get,
  Logger
} from '@nestjs/common'
import { Request, Response } from 'express'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { RedisService } from 'nestjs-redis'
const argon2 = require('argon2')
const svgCaptcha = require('svg-captcha')

import { ResponseRO } from 'src/shared/interface/response.interface'
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
  async login(@Body() loginUserDto: LoginUserDto): Promise<ResponseRO> {
    if (!loginUserDto.loginCaptchaKey) {
      return {
        success: false,
        statusCode: 400,
        message: '非法请求',
      }
    }

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
