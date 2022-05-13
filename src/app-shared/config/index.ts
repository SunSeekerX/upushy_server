/**
 * 解析环境变量配置
 * @author: SunSeekerX
 * @Date: 2021-07-10 11:40:07
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-13 20:18:40
 */

import { load as yamlLoad } from 'js-yaml'
import { readFileSync } from 'fs'
import * as chalk from 'chalk'
import { plainToClass } from 'class-transformer'
import { validateSync } from 'class-validator'
import { join } from 'path'

import { EnvConfig } from './entities'
import { isValidValue } from 'src/app-shared/utils'

const TAG = 'Env'
console.log(chalk.white(`${TAG}: 准备验证环境变量配置...`))
/**
 * 解析 yaml 配置
 */
const envFilePath = join(__dirname, `../../../env.${process.env.NODE_ENV.toLocaleLowerCase()}.yaml`)
const localEnvConfig = yamlLoad(readFileSync(envFilePath, 'utf8'))

if (!isValidValue(localEnvConfig)) {
  const msg = chalk.red(`${TAG}: 环境变量配置文件为空，文件路径: ${envFilePath}`)
  throw new Error(msg)
}

/**
 * 检查本地环境变量配置
 */
const envConfig = plainToClass(EnvConfig, localEnvConfig, {
  // 移除其他无关 Key 值
  excludeExtraneousValues: true,
})

/**
 *验证本地载入的环境变量配置
 */
const errors = validateSync(envConfig)
if (errors.length > 0) {
  console.log(chalk.red(JSON.stringify(_buildError(errors))))
  throw new Error(chalk.red(`${TAG}: 验证失败，请检查环境变量配置`))
} else {
  console.log(chalk.green(`${TAG}: 验证成功，正在启动服务...`))
}

/**
 * 获取环境变量
 * @param { string } key
 * @returns
 */
export const getEnv = <T>(key: string): T => envConfig[key]

/**
 * 构建错误提示
 * @param errors
 * @returns
 */
function _buildError(errors) {
  const result = {}
  errors.forEach((el) => {
    const prop = el.property
    Object.entries(el.constraints).forEach((constraint) => {
      result[prop] = constraint[1]
    })
  })
  return result
}
