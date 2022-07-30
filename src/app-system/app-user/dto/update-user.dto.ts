/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-25 23:26:50
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-06-25 23:27:16
 */

import { ApiProperty } from '@nestjs/swagger'
import { ValidateIf } from 'class-validator'

export class UpdateUserDto {
  @ApiProperty({
    type: String,
    description: '昵称',
  })
  @ValidateIf((el) => el.nickname)
  readonly nickname: string
}
