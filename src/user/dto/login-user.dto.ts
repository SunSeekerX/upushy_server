/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 22:43:20
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-04 15:16:28
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class LoginUserDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly username: string

  @ApiProperty()
  @IsNotEmpty()
  readonly password: string

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
  readonly loginCaptchaKey: string
}
