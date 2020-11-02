/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 18:11:03
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 14:27:06
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, ValidateIf } from 'class-validator'

export class CreateProjectDto {
  // 用户id
  userId?: string

  @ApiProperty({
    type: String,
    description: '项目名称',
  })
  @IsNotEmpty()
  readonly name: string

  @ApiProperty({
    type: String,
    description: '项目描述',
    default: '',
  })
  @ValidateIf(o => ![null, undefined].includes(o.describe))
  readonly describe: string
}
