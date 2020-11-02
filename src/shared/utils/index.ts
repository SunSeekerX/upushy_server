/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-04-07 20:45:22
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 14:24:44
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
 * 来源：https://www.jianshu.com/p/fdbf293d0a85
 * @param { Number } len uuid 长度
 * @param { Number } radix 基数
 */
export function guid(len: number = 32, radix: number = 16): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(
    '',
  )
  const uuid = []
  let i = 0
  radix = radix || chars.length

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    let r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
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

/**
 * compare ver1 > ver2
 * @param {String} ver1 string like x.y.z
 * @param {String} ver2 string like x.y.z
 */
export function compareVersion(ver1: string, ver2: string): boolean {
  const ver1List: Array<string | number> = ver1.split('.')
  const ver2List: Array<string | number> = ver2.split('.')
  ver1List.forEach((v, i) => (ver1List[i] = Number(v)))
  ver2List.forEach((v, i) => (ver2List[i] = Number(v)))

  const len =
    ver1List.length > ver2List.length ? ver1List.length : ver2List.length

  for (let i = 0; i < len; i++) {
    if (ver1List[i] > ver2List[i]) {
      return true
    } else if (ver1List[i] === ver2List[i]) {
      if (
        (!ver1List[i + 1] && !ver2List[i + 1]) ||
        (!ver1List[i + 1] && ver2List[i + 1])
      ) {
        return false
      } else if (ver1List[i + 1] && !ver2List[i + 1]) {
        return true
      }
    } else {
      return false
    }
  }
}
