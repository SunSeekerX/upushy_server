/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-12-21 11:26:56
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-10 00:51:06
 */

import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as dotenv from 'dotenv'
import * as chalk from 'chalk'
const envPath = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''

dotenv.config({
  path: `.env${envPath}`,
})

// 设置当前时区为 UTC+8
process.env.TZ = 'Asia/Shanghai'
let envObj = {}

try {
  envObj = yaml.load(fs.readFileSync('src/config/dev.yaml', 'utf8'))
  console.log(envObj)
} catch (e) {
  console.error(e)
}

enum EnvType {
  number = 'number',
  string = 'string',
  boolean = 'boolean',
}

export function getEnv<T extends EnvType>(key: string, type: T): T {
  const val: any = envObj[key]
  const valType = typeof val
  if (![null, undefined].includes(val) && valType === type) {
    return val
  } else {
    const msg = `GetEnv: Cannot get the "${key}"!, input: { key: '${key}', type: '${type}' } res: { value: ${val}, type: '${valType}' }`
    throw new Error(chalk.red(msg))
  }
}

// console.log(getEnv('server_port', EnvType.boolean))
