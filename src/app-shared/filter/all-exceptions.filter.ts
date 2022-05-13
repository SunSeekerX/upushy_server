/**
 * 异常拦截器
 * @author: SunSeekerX
 * @Date: 2021-09-14 18:28:30
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-11-28 22:01:29
 */

import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import type { Response } from 'express'

import { getEnv } from 'src/app-shared/config'
import { BaseResult } from 'src/app-shared/interface'

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    const responseBody: BaseResult = {
      statusCode: undefined,
      message: undefined,
      // timestamp: new Date().toISOString(),
    }

    if (exception instanceof HttpException) {
      // http 错误
      responseBody['statusCode'] = exception.getStatus()
      responseBody['message'] = exception.message
      if (!getEnv<boolean>('IS_PROD')) {
        responseBody['origin'] = exception.getResponse()
      }
    } else {
      // 应用程序错误
      responseBody['statusCode'] = HttpStatus.INTERNAL_SERVER_ERROR
      responseBody['message'] = 'Internal server error'
      if (!getEnv<boolean>('IS_PROD') && exception instanceof Error) {
        responseBody['error'] = exception.message
        console.error(exception)
      }
    }

    response.status(responseBody['statusCode']).json(responseBody)
  }
}
