/**
 * 项目默认配置
 * @author: SunSeekerX
 * @Date: 2021-07-10 11:02:12
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-13 20:54:51
 */

// ==============================环境变量开始===================================
/**
 * 默认运行端口
 */
export const SERVER_PORT = '3000'

/**
 * 是否正式环境
 */
export const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV)

/**
 * Api 前缀
 */
export const API_GLOBAL_PREFIX = '/api'

/**
 * 是否打开接口文档
 */
export const SERVER_DOC = true

/**
 * 是否自动同步数据库表格
 */
export const DB_TABLE_SYNC = false

/**
 * 是否使用 Redis 作为缓存
 */
export const IS_USING_REDIS = false

/**
 * 阿里云 sts 临时账户有效期，单位 min
 */
export const ALIYUN_RAM_TEMPORARY_EXPIRE = 15

/**
 * Token 有效期 （小 token） 默认：10h
 */
export const JWT_TOKEN_EXPIRES_IN = 10 * 60 * 60

/**
 * 刷新 Token 有效期（大 token）,必须比小 token 过期时间长 默认：7d
 */
export const JWT_REFRESH_TOKEN_EXPIRES_IN = 7 * 24 * 60 * 60

/**
 * Api 加密请求过期间隔，单位：秒
 */
export const API_SIGN_TIME_OUT = 15
// ==============================环境变量结束===================================

// ==============================系统配置开始===================================
/**
 * 是否开放注册 0 false 1 true
 */
export const IS_ENABLE_REGISTER = '1'

/**
 * 非管理员能否查看登录日志 0 false 1 true
 */
export const IS_USER_VIEW_LOGIN_LOG = '1'
// ==============================系统配置结束===================================
