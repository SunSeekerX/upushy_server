/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:30:45
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-04-22 23:43:19
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class CreateLoginLogDto {
  @ApiProperty({
    type: String,
    description: '用户名',
  })
  @IsNotEmpty()
  readonly username: string

  @ApiProperty({
    type: String,
    description: '登录IP地址',
  })
  @IsNotEmpty()
  readonly ipaddr: string

  @ApiProperty({
    type: String,
    description: '登录地点',
  })
  @IsNotEmpty()
  readonly loginLocation: string

  @ApiProperty({
    type: String,
    description: '浏览器类型',
  })
  @IsNotEmpty()
  readonly browser: string

  @ApiProperty({
    type: String,
    description: '操作系统',
  })
  @IsNotEmpty()
  readonly os: string

  @ApiProperty({
    type: String,
    description: '登录状态 0 失败 1 成功',
  })
  @Length(1)
  @IsNotEmpty()
  readonly status: string

  @ApiProperty({
    type: String,
    description: '提示消息',
  })
  @IsNotEmpty()
  readonly msg: string
}
