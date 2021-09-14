/**
 * 获取用户装饰器
 * @author: SunSeekerX
 * @Date: 2020-08-13 19:34:38
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:43:03
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  return request.user
})
