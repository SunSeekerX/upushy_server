/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-10 14:55:14
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-06 10:16:33
 */

import { NestMiddleware, HttpStatus, Injectable, HttpException } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { UserService } from 'src/user/user.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeaders = req.headers.authorization
    if (authHeaders && (authHeaders as string).split(' ')[1]) {
      const token = (authHeaders as string).split(' ')[1]
      try {
        const decoded: any = verify(token, process.env.TOKEN_SECRET)
        const user = await this.userService.findById(decoded.id)
        if (!user) {
          throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED)
        }

        req.user = user.user

        next()
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.UNAUTHORIZED)
      }
    } else {
      throw new HttpException('Not authorized.', HttpStatus.UNAUTHORIZED)
    }
  }
}
