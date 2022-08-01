/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:17:46
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-10 12:27:11
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class ModifyAppConfigDto {
  @ApiProperty({
    type: String,
    description: '配置键名',
    example: 'isEnableRegister',
  })
  @IsNotEmpty()
  readonly configKey: string

  @ApiProperty({
    type: String,
    description: '配置值',
    example: '1',
  })
  @IsNotEmpty()
  readonly configValue: string
}
