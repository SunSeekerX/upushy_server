/**
 * 环境变量配置类
 * @author: SunSeekerX
 * @Date: 2021-07-10 12:49:06
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-13 20:54:44
 */

import { IsNotEmpty, IsNumber, IsBoolean, IsString, Min, IsIP, IsPort, ValidateIf } from 'class-validator'
import { Expose, Transform } from 'class-transformer'
import type { TransformFnParams } from 'class-transformer'
import { isNil } from 'lodash'

import * as defaultEnvConfig from '../default'
import { isValidValue } from 'src/app-shared/utils'

export class EnvConfig {
  /**
   * 系统服务配置
   */
  /**
   * 运行端口
   */
  @Expose()
  @IsString()
  @IsPort()
  @Transform((v) => setDefault(v, defaultEnvConfig.SERVER_PORT), { toClassOnly: true })
  SERVER_PORT: string

  /**
   * 服务域名
   */
   @Expose()
   @IsString()
   @IsNotEmpty()
   SERVER_DOMAIN: string

   /**
   * 上传文件限制 单位: mb
   */
    @Expose()
    @IsNumber()
    @Transform((v) => setDefault(v, defaultEnvConfig.SERVER_UPLOAD_LIMIT), { toClassOnly: true })
    SERVER_UPLOAD_LIMIT: number

  /**
   * 是否正式环境
   */
  @Expose()
  @IsBoolean()
  @Transform((v) => setDefault(v, defaultEnvConfig.IS_PROD), { toClassOnly: true })
  IS_PROD: boolean

  /**
   * 是否打开接口文档
   */
  @Expose()
  @IsBoolean()
  @Transform((v) => setDefault(v, defaultEnvConfig.SERVER_DOC), { toClassOnly: true })
  SERVER_DOC: boolean

  /**
   * Token 生成加盐
   */
  @Expose()
  @IsString()
  @IsNotEmpty()
  SERVER_JWT_SECRET: string

  /**
   * Token 有效期
   */
  @Expose()
  @IsNumber()
  @Transform((v) => setDefault(v, defaultEnvConfig.JWT_TOKEN_EXPIRES_IN), { toClassOnly: true })
  JWT_TOKEN_EXPIRES_IN: number

  /**
   * 刷新 Token 有效期
   */
  @Expose()
  @IsNumber()
  @Transform((v) => setDefault(v, defaultEnvConfig.JWT_REFRESH_TOKEN_EXPIRES_IN), { toClassOnly: true })
  JWT_REFRESH_TOKEN_EXPIRES_IN: number

  /**
   * Api 前缀
   */
  @Expose()
  @IsString()
  @Transform((v) => setDefault(v, defaultEnvConfig.API_GLOBAL_PREFIX), { toClassOnly: true })
  API_GLOBAL_PREFIX: string

  /**
   * Api RSA 加密私钥(使用base64编码)
   */
  @Expose()
  @IsString()
  @IsNotEmpty()
  API_SIGN_RSA_PRIVATE_KEY_BASE64: string

  /**
   * Api 签名加密请求有效期
   */
  @Expose()
  @Min(15)
  @IsNumber()
  @Transform((v) => setDefault(v, defaultEnvConfig.API_SIGN_TIME_OUT), { toClassOnly: true })
  API_SIGN_TIME_OUT: number

  /**
   * 阿里云 oss
   */
  @Expose()
  @IsNotEmpty()
  readonly SERVER_WEB_OSS: boolean

  @Expose()
  @IsNotEmpty()
  readonly ALIYUN_OSS_ENDPOINT: string

  @Expose()
  @IsNotEmpty()
  readonly ALIYUN_OSS_BUCKET: string

  /**
   * 阿里云账号
   */
  @Expose()
  @ValidateIf((el) => !el.SERVER_WEB_OSS)
  @IsNotEmpty()
  readonly ALIYUN_ACCOUNT_ID: string

  @Expose()
  @ValidateIf((el) => !el.SERVER_WEB_OSS)
  @IsNotEmpty()
  readonly ALIYUN_ACCOUNT_RAM_ROLE: string

  @Expose()
  @ValidateIf((el) => !el.SERVER_WEB_OSS)
  @IsNotEmpty()
  readonly ALIYUN_RAM_ACCESS_KEY_ID: string

  @Expose()
  @ValidateIf((el) => !el.SERVER_WEB_OSS)
  @IsNotEmpty()
  readonly ALIYUN_RAM_ACCESS_KEY_SECRET: string

  @Expose()
  @ValidateIf((el) => !el.SERVER_WEB_OSS && !isNil(el.ALIYUN_RAM_TEMPORARY_EXPIRE))
  @Min(15)
  @IsNotEmpty()
  @IsNumber()
  readonly ALIYUN_RAM_TEMPORARY_EXPIRE: number

  @Expose()
  @Transform((v) => setDefault(v, defaultEnvConfig.SERVER_DB_TABLE_SYNC), { toClassOnly: true })
  @ValidateIf((el) => !isNil(el.SERVER_DB_TABLE_SYNC))
  @IsBoolean()
  readonly SERVER_DB_TABLE_SYNC: boolean

  /**
   * 数据库
   */
  @Expose()
  @IsIP()
  @IsNotEmpty()
  @IsString()
  @ValidateIf((el) => el.DB_HOST !== 'localhost')
  DB_HOST: string

  @Expose()
  @IsString()
  @IsPort()
  DB_PORT: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  DB_USER: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  DB_PASSWORD: string

  @Expose()
  @IsNotEmpty()
  @IsString()
  DB_DATABASE: string

  /**
   * Redis
   */
  @Expose()
  @IsBoolean()
  @Transform((v) => setDefault(v, defaultEnvConfig.IS_USING_REDIS), { toClassOnly: true })
  IS_USING_REDIS: boolean

  @Expose()
  @ValidateIf((el) => el.IS_USING_REDIS)
  @IsIP()
  @IsString()
  REDIS_HOST: string

  @Expose()
  @ValidateIf((el) => el.IS_USING_REDIS)
  @IsString()
  @IsPort()
  REDIS_PORT: string

  @Expose()
  @ValidateIf((el) => el.IS_USING_REDIS)
  @IsString()
  REDIS_DB: string

  @Expose()
  @ValidateIf((el) => el.IS_USING_REDIS)
  @IsString()
  REDIS_PASSWORD: string
}

function setDefault(v: TransformFnParams, rollback: unknown): unknown {
  return isValidValue(v.value) ? v.value : rollback
}
