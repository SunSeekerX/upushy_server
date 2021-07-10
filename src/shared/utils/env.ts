/**
 * 获取环境变量配置
 * @author: SunSeekerX
 * @Date: 2021-07-10 11:40:07
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-10 17:42:31
 */

import * as yaml from 'js-yaml'
import * as fs from 'fs'
import * as chalk from 'chalk'
import * as defaultConfig from 'src/shared/config/default'
import { plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'
import { ENVS } from 'src/shared/config/default'
import LocalEnv from 'src/shared/config/local-env'
import { type } from '../../../../../common/vuepress-theme-hope/packages/feed/src/types/index'

type EnvType2 = number | string | boolean
const TAG = 'Environment'
const emptyList = [null, undefined]

console.log(chalk.white(`${TAG}: 开始载入环境变量配置，准备验证...`))

const envPath: string = process.env.NODE_ENV
if (!ENVS.includes(envPath)) {
  const msg = chalk.red(`${TAG}: "NODE_ENV" 环境变量配置不正确，可选: ${ENVS.toString()}, 当前: ${envPath}`)
  throw new Error(msg)
}

/**
 * 解析 yaml 配置
 */
const localEnvConfig = yaml.load(fs.readFileSync(`src/shared/config/env.${envPath.toLocaleLowerCase()}.yaml`, 'utf8'))

/**
 * 检查本地环境变量配置
 */
const localEnvObject = plainToClass(LocalEnv, localEnvConfig, { excludeExtraneousValues: true })

/**
 * 构建错误提示
 * @param errors
 * @returns
 */
function buildError(errors) {
  const result = {}
  errors.forEach((el) => {
    const prop = el.property
    Object.entries(el.constraints).forEach((constraint) => {
      result[prop] = `${constraint[1]}`
    })
  })
  return result
}

/**
 * 验证本地载入的环境变量配置
 */
export function onValidateLocalEnvFile(): void {
  const errors = validateSync(localEnvObject)
  if (errors.length > 0) {
    console.log(chalk.red(`${TAG}: 验证失败，请检查环境变量配置`))
    const errorsObj = chalk.red(JSON.stringify(buildError(errors)))
    console.log(errorsObj)
    const msg = chalk.red(`${TAG}: 本地环境变量配置有误`)
    throw new Error(msg)
  } else {
    console.log(chalk.green(`${TAG}: 验证成功，正在启动服务...`))
  }
}

/**
 * 获取环境配置错误
 */
function onGetEnvError(key: string, type: string | number | boolean, val: any, valType: any): void {
  const msg = chalk.red(
    `${TAG}: Can't find env value of "${key}"!, input: { key: '${key}', type: '${type}' } res: { value: ${val}, type: '${valType}' }`
  )
  throw new Error(msg)
}

/**
 * 获取本地环境变量配置
 * @param { string } key
 * @param { T extends EnvType } type
 * @param { boolean } must
 * @returns { T extends type}
 */
function getEnvLocal<T extends EnvType2>(key: string, type: T, must: boolean): T {
  const val: any = localEnvConfig[key]
  const valType = typeof val
  if (must) {
    // 必要
    return ![null, undefined].includes(val) && valType === type.toString()
      ? val
      : onGetEnvError(key, type, val, valType)
  } else {
    // 非必要
    return [null, undefined].includes(val) || valType === type.toString() ? val : onGetEnvError(key, type, val, valType)
  }
}

/**
 * 获取环境变量
 * @param { string } key
 * @param { T extends EnvType } type
 * @returns
 */
export function getEnv<T extends string | number | boolean>(key: string, type: T): T {
  const notMustKeys = Object.keys(defaultConfig)
  const mustFlag = !notMustKeys.includes(key)
  const localVal = getEnvLocal<T>(key, type, mustFlag)
  const val = defaultConfig[key]
  type wantType = typeof T

  if (mustFlag) {
    if (!emptyList.includes(localVal)) {
      return localVal
    } else {
      onGetEnvError(key, type, val, typeof val)
    }
  } else {
    if (!emptyList.includes(localVal)) {
      return localVal
    } else if (val && typeof val === type) {
      return val
    } else {
      onGetEnvError(key, type, val, typeof val)
    }
  }
}
