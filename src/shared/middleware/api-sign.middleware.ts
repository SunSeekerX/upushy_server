/**
 * Api 签名加密中间件
 * @author: SunSeekerX
 * @Date: 2020-08-17 15:18:20
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:57:58
 */

import { Injectable, NestMiddleware, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as md5 from 'md5'
import { Cache } from 'cache-manager'

import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'
import { CacheService } from 'src/cache/cache.service'
import { genNodeRSAObj, rsaDecrypt, base64Decode } from 'src/shared/utils'

const API_SIGN_RSA_PRIVATE_KEY = base64Decode(getEnv<string>('API_SIGN_RSA_PRIVATE_KEY_BASE64', EnvType.string))
const nodeRSAObj = genNodeRSAObj(API_SIGN_RSA_PRIVATE_KEY, 'pkcs8', {
  encryptionScheme: 'pkcs1',
})

const API_SIGN_TIME_OUT = getEnv<number>('API_SIGN_TIME_OUT', EnvType.number)

@Injectable()
export class ApiSignMiddleware implements NestMiddleware {
  private readonly ctxPrefix: string = ApiSignMiddleware.name
  private readonly logger: Logger = new Logger(this.ctxPrefix)

  cacheManager: Cache

  constructor(private cacheService: CacheService) {
    this.cacheManager = this.cacheService.getCacheManager()
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { method, originalUrl, ip } = req
    const { nonce = '', sign = '' } = req.headers
    if (!nonce || !sign) {
      this.logger.error(`code: ${HttpStatus.FORBIDDEN} | method: ${method} | path: ${originalUrl} | ip: ${ip} | message: 非法请求`)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
    }

    try {
      const decrypted: string = rsaDecrypt(nodeRSAObj, nonce as string)
      const nonceArr: string[] = decrypted.split(',')

      /**
       * @description 防止请求过期
       */
      const TDOA: number = new Date().getTime() - Number(nonceArr[1])
      if (TDOA > API_SIGN_TIME_OUT * 1000) {
        throw new HttpException(
          `code: ${
            HttpStatus.FORBIDDEN
          } | method: ${method} | path: ${originalUrl} | ip: ${ip} | message: 请求过期,请求到达时间：${(
            TDOA / 1000
          ).toFixed(2)}s`,
          HttpStatus.FORBIDDEN
        )
      }

      /**
       * @description 防止请求重放
       */
      const uuid = await this.cacheManager.get(`ApiSign:Nonce:${nonceArr[0]}`)
      if (uuid) {
        throw new HttpException(
          `code: ${HttpStatus.FORBIDDEN} | method: ${method} | path: ${originalUrl} | ip: ${ip} | message: ${API_SIGN_TIME_OUT}s 内重复请求`,
          HttpStatus.FORBIDDEN
        )
      }
      await this.cacheManager.set(`ApiSign:Nonce:${nonceArr[0]}`, nonceArr[0], {
        ttl: API_SIGN_TIME_OUT,
      })

      /**
       * @description 防止参数被篡改
       * 这里ts分析req.query可能为对象形式，所以设置为any类型
       */
      let keys: Array<any> = [nonceArr[0], nonceArr[1]]
      switch (req.method) {
        case 'POST':
        case 'DELETE':
        case 'PUT':
          if (Object.keys(req.body || {}).length) {
            keys = keys.concat(Object.keys(req.body))
            keys = keys.concat(Object.values(req.body))
          }
          break
        case 'GET':
          if (Object.keys(req.query || {}).length) {
            keys = keys.concat(Object.keys(req.query))
            keys = keys.concat(Object.values(req.query))
          }
          break
        default:
          break
      }

      for (let item of keys) {
        if (typeof item !== 'string') {
          item = String(item)
        }
      }
      const Sign = md5(keys.sort().toString())
      if (sign !== Sign) {
        throw new HttpException(
          `code: ${HttpStatus.FORBIDDEN} | method: ${method} | path: ${originalUrl} | ip: ${ip} | message: 参数被篡改`,
          HttpStatus.FORBIDDEN
        )
      }
    } catch (error) {
      Logger.error(error.message)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
    }
    next()
  }
}
