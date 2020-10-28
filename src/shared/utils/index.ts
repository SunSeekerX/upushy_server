/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-04-07 20:45:22
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 16:27:50
 */

import * as os from 'os'
import { Request } from 'express'
import axios from 'axios'
import * as iconv from 'iconv-lite'

/**
 * @name 获取本机ip
 * @returns { String } 当前所在网络的ip地址
 */
export function getIPAdress(): string {
  const interfaces = os.networkInterfaces()
  for (const devName in interfaces) {
    const iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i]
      if (
        alias.family === 'IPv4' &&
        alias.address !== '127.0.0.1' &&
        !alias.internal
      ) {
        return alias.address
      }
    }
  }
}

/**
 * 本算法来源于简书开源代码，详见：https://www.jianshu.com/p/fdbf293d0a85
 * 全局唯一标识符（uuid，Globally Unique Identifier）,也称作 uuid(Universally Unique IDentifier)
 * 一般用于多个组件之间,给它一个唯一的标识符,或者v-for循环的时候,如果使用数组的index可能会导致更新列表出现问题
 * 最可能的情况是左滑删除item或者对某条信息流"不喜欢"并去掉它的时候,会导致组件内的数据可能出现错乱
 * v-for的时候,推荐使用后端返回的id而不是循环的index
 * @param {Number} len uuid的长度
 * @param {Boolean} firstU 将返回的首字母置为"u"
 * @param {Nubmer} radix 生成uuid的基数(意味着返回的字符串都是这个基数),2-二进制,8-八进制,10-十进制,16-十六进制
 */
export function guid(len = 32, radix = null) {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
    '',
  )
  const uuid = []
  radix = radix || chars.length

  if (len) {
    // 如果指定uuid长度,只是取随机的字符,0|x为位运算,能去掉x的小数位,返回整数位
    for (let i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r
    // rfc4122标准要求返回的uuid中,某些位为固定的字符
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    for (let i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

/**
 * Convert Bytes to Human-Readable Format
 * @param { Number } bytes
 * @returns { String }
 */
export function bytesToSize(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']

  if (bytes === 0) {
    return 'n/a'
  }

  const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))))

  if (i === 0) {
    return bytes + ' ' + sizes[i]
  }

  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i]
}

/**
 * 获取请求的客户端ip地址， 只能获取ipv4 情况下的地址。v6 需要额外的处理
 * @param request 请求对象
 */
export function getIPAdressByRequest(request: Request): string | string[] {
  if (!request) {
    return 'unknown'
  }
  let ip = request.headers['x-forwarded-for']
  !ip && (ip = request.headers['Proxy-Client-IP'])
  !ip && (ip = request.headers['X-Forwarded-For'])
  !ip && (ip = request.headers['WL-Proxy-Client-IP'])
  !ip && (ip = request.headers['X-Real-IP'])
  !ip && (ip = request.headers['X-Real-IP'])
  !ip && (ip = request.ip)

  return ip === '::1' ? '127.0.0.1' : ip
}

/**
 * 判断 ip 地址是否为内网地址
 */
export function isInternalIPAdress(ip: string): boolean {
  return /^(127\.0\.0\.1)|(localhost)|(10\.\d{1,3}\.\d{1,3}\.\d{1,3})|(172\.((1[6-9])|(2\d)|(3[01]))\.\d{1,3}\.\d{1,3})|(192\.168\.\d{1,3}\.\d{1,3})$/.test(
    ip,
  )
}

/**
 * 获取ip地址地理位置
 */
const IP_URL = 'http://whois.pconline.com.cn/ipJson.jsp'
export async function getIPLocation(ip: string): Promise<any> {
  if (isInternalIPAdress(ip)) {
    return '内网IP'
  } else {
    const res = await axios.get(`${IP_URL}?ip=${ip}&json=true`, {
      responseType: 'stream',
    })
    return new Promise((resolve, reject) => {
      const chunks = []

      res.data.on('data', chunk => {
        chunks.push(chunk)
      })

      res.data.on('end', () => {
        const buffer = Buffer.concat(chunks)
        const str = iconv.decode(buffer, 'gbk')
        const jsonRes = JSON.parse(str)
        resolve(`${jsonRes.pro}${jsonRes.city}`)
      })
    })
  }
}
