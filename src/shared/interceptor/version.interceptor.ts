/**
 * @name: 版本号拦截器
 * @author: SunSeekerX
 * @Date: 2021-04-26 11:47:39
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-04-27 21:30:29
 */

import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class AppInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log(CallHandler)
    return next.handle().pipe(map((data) => ({ data }))) // map操作符与Array.prototype.map类似
  }
}
