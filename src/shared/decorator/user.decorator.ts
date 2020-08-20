/**
 * @name: 
 * @author: SunSeekerX
 * @Date: 2020-08-13 19:34:38
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-13 19:36:41
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)
