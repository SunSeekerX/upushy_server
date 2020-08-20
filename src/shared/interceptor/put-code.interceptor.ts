/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-08-04 10:56:11
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-04 10:58:51
 */

import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class PutCodeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
  }
}
