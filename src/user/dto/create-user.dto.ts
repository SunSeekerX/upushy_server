/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:17:46
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-10 12:27:11
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class CreateUserDto {
  @ApiProperty({
    type: String,
    description: '用户名',
  })
  @IsNotEmpty()
  readonly username: string

  @ApiProperty({
    type: String,
    description: '密码',
  })
  @IsNotEmpty()
  readonly password: string

  @ApiProperty({
    type: String,
    description: '邮箱',
  })
  readonly email?: string

  @ApiProperty({
    type: String,
    description: '昵称',
  })
  readonly nickname?: string

  @ApiProperty({
    type: String,
    description: '图片验证码',
  })
  @Length(4)
  @IsNotEmpty()
  readonly imgCaptcha: string

  @ApiProperty({
    type: String,
    description: '图片验证码的key',
  })
  @Length(32)
  @IsNotEmpty()
  readonly imgCaptchaKey: string
}
