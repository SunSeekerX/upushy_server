/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-10 14:55:14
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-13 20:29:19
 */

import { NestMiddleware, HttpStatus, Injectable, HttpException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { UserService } from 'src/user/user.service'
import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void | Error> {
    const authorization: string = req.headers.authorization
    if (!authorization) {
      // No token
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED)
    }
    // Get token
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
        message: 'Token expired',
        errors: [error.message],
      })
      // throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
    }
  }
}
