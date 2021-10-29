/**
 * 用户控制器
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:08:25
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 20:52:38
 */

import { Controller, Post, Body, HttpCode, Get, Logger, UseInterceptors } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger'
import { verify } from 'jsonwebtoken'
import { Cache } from 'cache-manager'
// import { RedisService } from 'nestjs-redis'
// import * as Redis from 'ioredis'
import * as argon2 from 'argon2'
import * as svgCaptcha from 'svg-captcha'

import { BaseResult } from 'src/shared/interface/response.interface'
import { LoginInterceptor } from 'src/shared/interceptor'
import { LoginUserDto, CreateUserDto, RefreshTokenDto } from './dto/index'
import { UserService } from './user.service'
import { guid } from 'src/shared/utils/index'
import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'
import { CacheService } from 'src/cache/cache.service'

@ApiBearerAuth()
@ApiTags('users')
@Controller('user')
export class UserController {
  // redis 客户端
  // redisClient: Redis.Redis | null = null
  cacheManager: Cache

  // constructor(private readonly redisService: RedisService, private readonly userService: UserService) {}
  constructor(private cacheService: CacheService, private readonly userService: UserService) {
    this.cacheManager = this.cacheService.getCacheManager()
  }

  // 注册图片验证码
  @ApiOperation({ summary: '注册图片验证码' })
  @Get('/register/captcha')
  async registerCodeImg(): Promise<BaseResult> {
    const captcha = svgCaptcha.create({
      ignoreChars: '0o1i',
      noise: 1,
      color: true,
    })

    const captchaKey = guid()
    try {
      // const redisClient = await this._getRedisClient()
      // await redisClient.set(`imgCaptcha:register:${captchaKey}`, captcha.text.toLowerCase(), 'ex', 60)

      await this.cacheManager.set(`imgCaptcha:register:${captchaKey}`, captcha.text.toLowerCase(), {
        ttl: 60,
      })
      return {
        statusCode: 200,
        message: '获取验证码成功',
        data: {
          img: captcha.data,
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
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<BaseResult> {
    if (!createUserDto.imgCaptcha) {
      return {
        statusCode: 400,
        message: '非法请求',
      }
    }

    try {
      // const redisClient = await this._getRedisClient()
      // const captchaText = await redisClient.get(`imgCaptcha:register:${createUserDto.imgCaptchaKey}`)
      const captchaText = await this.cacheManager.get<string>(`imgCaptcha:register:${createUserDto.imgCaptchaKey}`)

      if (captchaText === createUserDto.imgCaptcha) {
        const user = await this.userService.create(createUserDto)

        if (user) {
          return {
            statusCode: 200,
            message: '注册成功，请登录',
            data: user,
          }
        }
      } else {
        return {
          statusCode: 400,
          message: '验证码错误',
        }
      }
    } catch (error) {
      Logger.error(error.message)

      return {
        statusCode: 400,
        message: error.message,
      }
    }
  }

  // 登录
  @ApiOperation({ summary: '用户登录' })
  @HttpCode(200)
  @Post('/login')
  @UseInterceptors(LoginInterceptor)
  async login(@Body() loginUserDto: LoginUserDto): Promise<BaseResult> {
    if (!loginUserDto.loginCaptchaKey) {
      return {
        statusCode: 400,
        message: '非法请求',
      }
    }

    try {
      // const redisClient = await this._getRedisClient()
      // const loginCaptchaText = await redisClient.get(`imgCaptcha:login:${loginUserDto.loginCaptchaKey}`)
      const loginCaptchaText = await this.cacheManager.get(`imgCaptcha:login:${loginUserDto.loginCaptchaKey}`)
      if (!loginCaptchaText) {
        return {
          statusCode: 400,
          message: '验证码已失效',
        }
      }

      if (loginCaptchaText === loginUserDto.imgCaptcha) {
        const _user = await this.userService.findOne(loginUserDto)

        if (!_user) {
          return {
            statusCode: 200,
            message: `${loginUserDto.username}不存在`,
          }
        }
        // 检查密码
        if (await argon2.verify(_user.password, loginUserDto.password)) {
          const token = await this.userService.generateJWT(_user)
          const refreshToken = await this.userService.generateRefreshToken(_user)
          const { username, nickname } = _user
          // const user = { token, username, nickname }

          return {
            statusCode: 200,
            message: '登录成功',
            data: {
              token,
              refreshToken,
              userInfo: {
                username,
                nickname,
              },
            },
          }
        } else {
          return { statusCode: 200, message: '密码错误' }
        }
      } else {
        return {
          statusCode: 400,
          message: '验证码错误',
        }
      }
    } catch (error) {
      Logger.error(error.message)
      return {
        statusCode: 400,
        message: '登录失败',
        errors: error.message,
      }
    }
  }

  // 登录图片验证码
  @ApiOperation({ summary: '登录验证码' })
  @Get('/login/captcha')
  async loginCodeImg(): Promise<BaseResult> {
    const captcha = svgCaptcha.create({
      ignoreChars: '0o1il',
      noise: 1,
      color: true,
    })

    const captchaKey = guid()
    try {
      // const redisClient = await this._getRedisClient()
      // await redisClient.set(`imgCaptcha:login:${captchaKey}`, captcha.text.toLowerCase(), 'ex', 60)
      await this.cacheManager.set(`imgCaptcha:login:${captchaKey}`, captcha.text.toLowerCase(), {
        ttl: 60,
      })

      return {
        statusCode: 200,
        message: '获取验证码成功',
        data: {
          img: captcha.data,
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

  // 用 refreshToken 获取新的 Token
  @ApiOperation({ summary: '刷新token' })
  @HttpCode(200)
  @Post('/token')
  async refreshToken(@Body() { refreshToken }: RefreshTokenDto): Promise<BaseResult> {
    try {
      // 解码 refreshToken
      const decoded: any = verify(refreshToken, getEnv<string>('TOKEN_SECRET', EnvType.string))
      // 获取用户
      const user = await this.userService.findById(decoded.id)
      // if (!user) {
      //   return {
      //     success: false,
      //     statusCode: 400,
      //     message: 'User not found.',
      //   }
      // }
      const token = await this.userService.generateJWT(user)
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
      // throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
    }
  }

  // 获取 redis 客户端
  // async _getRedisClient(): Promise<Redis.Redis> {
  //   if (!this.redisClient) {
  //     this.redisClient = await this.redisService.getClient()
  //   }
  //   return this.redisClient
  // }
}
