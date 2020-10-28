/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 15:56:31
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 17:22:39
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Logger,
} from '@nestjs/common'
import { Request } from 'express'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { BasicService } from 'src/basic/basic.service'
import { getIPLocation } from 'src/shared/utils/index'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly basicService: BasicService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req: Request = context.switchToHttp().getRequest<Request>()
    // const res: Response = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      tap(data => {
        // 解析ip地址
        getIPLocation(req.ip)
          .then(loginLocation => {
            this.basicService.createLoginLog({
              username: req.body.username,
              ipaddr: req.ip,
              loginLocation,
              browser: `${req.useragent.browser}:${req.useragent.version}`,
              os: req.useragent.os,
              status: data.success ? '1' : '0',
              msg: data.message,
              loginTime: new Date(),
            })
          })
          .catch(err => {
            Logger.error(`---解析ip地址失败错误详情：${err.message}---`)
          })
      }),
    )
  }
}
