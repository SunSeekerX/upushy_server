/**
 * @name: 版本号拦截器
 * @author: SunSeekerX
 * @Date: 2021-04-26 11:47:39
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-04-28 00:25:48
 */

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import type { ResponseRO } from 'src/shared/interface/response.interface'
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version } = require('../../../package.json')

@Injectable()
export class VersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: ResponseRO) => {
        data.version = version
        return data
      })
    )
  }
}
