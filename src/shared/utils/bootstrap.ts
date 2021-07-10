/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-12-21 11:26:56
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-10 11:44:06
 */

import * as dotenv from 'dotenv'
const envPath = process.env.NODE_ENV ? `.${process.env.NODE_ENV}` : ''

dotenv.config({
  path: `.env${envPath}`,
})

// 设置当前时区为 UTC+8
process.env.TZ = 'Asia/Shanghai'
