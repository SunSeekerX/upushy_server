/**
 * Token 校验中间件
 * @author: SunSeekerX
 * @Date: 2020-07-10 14:55:14
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:41:49
 */

import { NestMiddleware, HttpStatus, Injectable, HttpException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { UserService } from 'src/user/user.service'
import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'

@Injectable()
export class TokenAuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void | Error> {
    const { method, originalUrl, ip } = req
    const authorization: string = req.headers.authorization
    if (!authorization) {
      // 无 Token
      throw new HttpException(`code: ${
        HttpStatus.FORBIDDEN
      } | method: ${method} | path: ${originalUrl} | ip: ${ip} | message: 未登录！`, HttpStatus.UNAUTHORIZED)
    }
    const token = authorization.split(' ')[1]

    try {
      const decoded: any = verify(token, getEnv<string>('TOKEN_SECRET', EnvType.string))
      const user = await this.userService.findById(decoded.id)
      // if (!user) {
      //   throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED)
      // }
      req.user = user
      next()
    } catch (error) {
      res.json({
        success: false,
        statusCode: 401,
        message: '登录过期',
        errors: [error.message],
      })
      // throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
    }
  }
}
