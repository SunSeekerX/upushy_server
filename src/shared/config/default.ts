/**
 * 项目默认配置
 * @author: SunSeekerX
 * @Date: 2021-07-10 11:02:12
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 20:39:47
 */

/**
 * 环境变量名配置
 */
export const ENVS = ['development', 'test', 'production', 'stage', 'prod', 'staging']

/**
 * 是否正式环境
 */
export const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

/**
 * 默认运行端口
 */
export const SERVER_PORT = 3000

/**
 * Api 前缀
 */
export const API_GLOBAL_PREFIX = 'api'

/**
 * 是否打开正式环境文档
 */
export const PRO_DOC = true

/**
 * 是否自动同步数据库表格
 */
export const DB_TABLE_SYNC = true

/**
 * Redis REDIS_PREFIX
 */
export const REDIS_PREFIX = ''

/**
 * 阿里云 sts 临时账户有效期，单位 min
 */
export const ALIYUN_RAM_TEMPORARY_EXPIRE = 15

/**
 * Token 生成加盐
 */
export const TOKEN_SECRET = 'secret-key'

/**
 * Api 加密请求过期间隔，单位：秒
 */
export const API_SIGN_TIME_OUT = 15
