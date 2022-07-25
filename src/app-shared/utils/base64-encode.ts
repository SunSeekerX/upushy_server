/**
 * Base64 编码解码
 * @author: SunSeekerX
 * @Date: 2021-09-14 15:50:11
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 15:54:53
 */

function base64Encode2String(val: string): string {
  return Buffer.from(val).toString('base64')
}

function base64Decode(val: string): string {
  return Buffer.from(val, 'base64').toString('utf-8')
}

export {
  base64Encode2String,
  base64Decode
}
