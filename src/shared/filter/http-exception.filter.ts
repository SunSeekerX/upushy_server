/**
 * 异常拦截器
 * @author: SunSeekerX
 * @Date: 2021-09-14 18:28:30
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 20:51:10
 */

import { ExceptionFilter, Catch, ArgumentsHost, HttpException, Logger } from '@nestjs/common'
import type { Response } from 'express'

import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly ctxPrefix: string = HttpExceptionFilter.name
  private readonly logger: Logger = new Logger(this.ctxPrefix)

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    // const request = ctx.getRequest<Request>()
    const status = exception.getStatus()
    const exceptionResponse = exception.getResponse()
    // const { method, url, ip } = request

    let message = 'Unknown'

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse
    } else if (exceptionResponse['error']) {
      message = exceptionResponse['error']
    }
    // this.logger.warn(`code: ${status} | method: ${method} | path: ${url} | ip: ${ip}`)
    this.logger.debug(exceptionResponse)

    // console.log({exception,response:exception.getResponse(), });
    const result = {
      statusCode: status,
      message,
    }

    if (!getEnv('IS_PROD', EnvType.boolean)) {
      result['origin'] = exceptionResponse
    }

    response.status(status).json(result)
  }
}
