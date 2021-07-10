/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2021-07-10 12:49:06
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-10 17:06:00
 */

import { IsNotEmpty, Max, Min, ValidateIf } from 'class-validator'
import { Expose } from 'class-transformer'

const emptyList = [null, undefined]
export default class LocalEnv {
  @Expose()
  @ValidateIf((o) => !emptyList.includes(o.SERVER_PORT))
  @Min(1)
  @Max(65535)
  readonly SERVER_PORT: number

  @Expose()
  @ValidateIf((o) => !emptyList.includes(o.PRO_DOC))
  readonly PRO_DOC: boolean

  @Expose()
  @IsNotEmpty()
  readonly WEB_OSS: boolean

  // ------ 阿里云 oss ------
  @Expose()
  @IsNotEmpty()
  readonly ALIYUN_OSS_ENDPOINT: string

  @Expose()
  @IsNotEmpty()
  readonly ALIYUN_OSS_BUCKET: string

  // ------ 阿里云账号 ------
  @Expose()
  @ValidateIf((o) => !o.WEB_OSS)
  @IsNotEmpty()
  readonly ALIYUN_ACCOUNT_ID: string

  @Expose()
  @ValidateIf((o) => !o.WEB_OSS)
  @IsNotEmpty()
  readonly ALIYUN_ACCOUNT_RAM_ROLE: string

  @Expose()
  @ValidateIf((o) => !o.WEB_OSS)
  @IsNotEmpty()
  readonly ALIYUN_RAM_ACCESS_KEY_ID: string

  @Expose()
  @ValidateIf((o) => !o.WEB_OSS)
  @IsNotEmpty()
  readonly ALIYUN_RAM_ACCESS_KEY_SECRET: string

  @Expose()
  @ValidateIf((o) => !o.WEB_OSS)
  @IsNotEmpty()
  readonly ALIYUN_RAM_TEMPORARY_EXPIRE: number
}
