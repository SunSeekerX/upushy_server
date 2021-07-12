/**
 * @name: 项目默认配置
 * @author: SunSeekerX
 * @Date: 2021-07-10 11:02:12
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-12 22:42:32
 */

/**
 * 环境名配置
 */
export const ENVS = ['development', 'test', 'production', 'stage', 'prod', 'staging']

/**
 * 运行端口
 */
export const SERVER_PORT = 3000

/**
 * 是否打开文档
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

// Api 加密私钥
export const API_SIGN_RSA_PRIVATE_KEY =
  '-----BEGIN PRIVATE KEY-----MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBALvlTV1G0b/q40bYbz/z2cV3tS10oxFiGkr7abO7HF0qp7NXrZMTxj/098sVF32IhOqliQOP9c4arcEFgpHr7mhek5j0xKR7u11DXY6bFKfhOVXdhl9e5s3mc5mhaPgD168txm6a0k+6TyQjHP2pKbzJis54tshfmR3Ley2XfGs3AgMBAAECgYAV6OUejVWEBYW/Cxnd4TdxmUXdKQ6ixke+mpZ2yMjD7GdluEGbNuEVMCF84ta8YqDtI6RYb/7/q4i7S0MwdMx1147YyCS9keZBliNsgnK3drDXAFlVYd1y5YLXrbDMgOiK5W6oIRCQ8455SiuhLd/60lGskeHis+hEhl3WLJ7CYQJBAPltCRSPrXeE5apbRLZq0zXcyUjmEakxe97bpzsjIE9XKwvCU8rISLA0s3HmUuEgqWXqwLvr8snM03WBduPrgQkCQQDA2RnKt2uBPLcZRs5aVo4SusJF9YjDFH/TAjutedOgxP6sYdmQ1iudyVgVE7dCeCKnnJti7rnJsGeXwWrG9to/AkB3+vgkONzjojzrzo1mBkrlHPiCJZGXRqNkV1rBOqtfHvoo5OhzohY9FIzBHF7/xjtWOC9P9jbK1cleO9GZ334pAkA3TkvKSj4Hi00Lb7YATHBkSLEsdRUqtTdPYYWR461gnv5Wm51Un0dU8ghTyxq0clWl8hDSF5qqj++1ot+nfeXrAkEAnMVbHK89dFYQ2yzEMIwF3R+VF0OY/v2ZtL72OOCRexnQ2ISPJokILYg52AH9Esbp8PKVXS5tQ9sQ/nyBsbr1wA==-----END PRIVATE KEY-----'

/**
 * Api 加密请求过期间隔，单位：秒
 */
export const API_SIGN_TIME_OUT = 15
