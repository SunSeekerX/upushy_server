/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-08-17 15:18:20
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-29 17:57:02
 */

import * as NodeRSA from 'node-rsa'
import {
  Injectable,
  NestMiddleware,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import * as md5 from 'md5'
import { RedisService } from 'nestjs-redis'

/**
 * @description 测试如果放在这里会偶尔出现 “Error during decryption (probably incorrect key). Original error: Error: Incorrect data or key”
 * 错误，猜测是内存被回收，放在每次校验创建测试
 */
const aPrivateKey = new NodeRSA(process.env.API_SIGN_RSA_PRIVATE_KEY, {
  encryptionScheme: 'pkcs1',
})
const API_SIGN_TIME_OUT = Number(process.env.API_SIGN_TIME_OUT)

@Injectable()
export class SignMiddleware implements NestMiddleware {
  constructor(private redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // const aPrivateKey = new NodeRSA(process.env.API_SIGN_RSA_PRIVATE_KEY, {
      //   encryptionScheme: 'pkcs1',
      // })
      const client = await this.redisService.getClient()
      const { nonce = '', sign = '' } = req.headers
      const decrypted: string = aPrivateKey.decrypt(nonce, 'utf8')
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
      const uuid = await client.get(`ApiSign:Nonce:${nonceArr[0]}`)
      if (uuid) {
        Logger.warn(`${API_SIGN_TIME_OUT}s内重复请求`)
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
      }
      await client.set(
        `ApiSign:Nonce:${nonceArr[0]}`,
        nonceArr[0],
        'ex',
        API_SIGN_TIME_OUT,
      )

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

      // console.log({ method: req.method, query: req.query, body: req.body })
    } catch (error) {
      Logger.error(error.message)
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN)
    }

    next()
  }
}
