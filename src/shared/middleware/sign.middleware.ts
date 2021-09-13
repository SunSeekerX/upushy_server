/**
 * Api 签名加密中间件
 * @author: SunSeekerX
 * @Date: 2020-08-17 15:18:20
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 00:33:10
 */

import * as NodeRSA from 'node-rsa'
import { Injectable, NestMiddleware, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as md5 from 'md5'
import { Cache } from 'cache-manager'

import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'
import { CacheService } from 'src/cache/cache.service'

/**
 * @description 测试如果放在这里会偶尔出现 “Error during decryption (probably incorrect key). Original error: Error: Incorrect data or key”
 * 错误，猜测是内存被回收，放在每次校验创建测试
 */
const aPrivateKey = new NodeRSA(getEnv<string>('API_SIGN_RSA_PRIVATE_KEY', EnvType.string), {
  encryptionScheme: 'pkcs1',
})
const API_SIGN_TIME_OUT = getEnv<number>('API_SIGN_TIME_OUT', EnvType.number)

@Injectable()
export class SignMiddleware implements NestMiddleware {
  private readonly ctxPrefix: string = SignMiddleware.name
  private readonly logger: Logger = new Logger(this.ctxPrefix)
  cacheManager: Cache

  constructor(private cacheService: CacheService) {
    this.cacheManager = this.cacheService.getCacheManager()
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { method, originalUrl, ip } = req
    try {
      // const aPrivateKey = new NodeRSA(getEnv<string>('API_SIGN_RSA_PRIVATE_KEY', EnvType.string), {
      //   encryptionScheme: 'pkcs1',
      // })
      // const client = await this.redisService.getClient()
      const { nonce = '', sign = '' } = req.headers
      const decrypted: string = aPrivateKey.decrypt(nonce as string, 'utf8')
      // console.log({ decrypted });
      const nonceArr: string[] = decrypted.split(',')
      if (nonceArr.length !== 2) {
        Logger.warn(`RSA签名数组长度为：${nonceArr.length}`)
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
      }

      /**
       * @description 防止请求过期
       */
      const TDOA: number = new Date().getTime() - Number(nonceArr[1])
      if (TDOA > API_SIGN_TIME_OUT * 1000) {
        Logger.warn(`请求过期,请求到达时间：${(TDOA / 1000).toFixed(2)}s`)
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
      }

      /**
       * @description 防止请求重放
       */
      // const uuid = await client.get(`ApiSign:Nonce:${nonceArr[0]}`)
      console.log('123123123123')
      const uuid = await this.cacheManager.get(`ApiSign:Nonce:${nonceArr[0]}`)
      if (uuid) {
        // this.logger.warn(`code: ${statusCode} | method: ${method} | path: ${originalUrl} | ip: ${ip}`)
        // Logger.warn(`${API_SIGN_TIME_OUT}s内重复请求`)
        // throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
        throw new HttpException(
          `code: ${HttpStatus.FORBIDDEN} | method: ${method} | path: ${originalUrl} | ip: ${ip} | message: ${API_SIGN_TIME_OUT}s 内重复请求`,
          HttpStatus.FORBIDDEN
        )
      }
      // await client.set(`ApiSign:Nonce:${nonceArr[0]}`, nonceArr[0], 'ex', API_SIGN_TIME_OUT)
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
        Logger.warn('参数可能被篡改')
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
      }
      console.log('request++++++++++++', { decrypted })
    } catch (error) {
      Logger.error(error.message)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
    }
    next()
  }
}
