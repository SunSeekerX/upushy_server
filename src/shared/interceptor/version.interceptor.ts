/**
 * 版本号拦截器
 * @author: SunSeekerX
 * @Date: 2021-04-26 11:47:39
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 20:02:26
 */

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import type { BaseResult } from 'src/app-shared/interface'

@Injectable()
export class VersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: BaseResult) => {
        return data
      })
    )
  }
}
