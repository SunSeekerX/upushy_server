/**
 * 项目配置
 * @author: SunSeekerX
 * @Date: 2021-07-09 16:04:03
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-09 18:20:33
 */

// 项目端口
export const SERVER_PORT = 3000

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