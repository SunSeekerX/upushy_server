import { SnowFlake } from './snowflake'

const idWorker = new SnowFlake(1n, 1n)

/**
 * 获取雪花id
 */
export function genId(): string {
  return idWorker.nextId().toString()
}

/**
 * 来源：https://www.jianshu.com/p/fdbf293d0a85
 * @param { Number } len uuid 长度
 * @param { Number } radix 基数
 */
export function guid(len = 32, radix = 16): string {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
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
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return uuid.join('')
}

/**
 * 检查一个给定的值是否有效（不为 null,或者 undefined）
 * @param val { unknown } 需要检查的值
 * @returns 检查结果
 */
export function isValidValue(val: unknown): boolean {
  const emptyList = [null, undefined]
  return !emptyList.includes(val)
}
