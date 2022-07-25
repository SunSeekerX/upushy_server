/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-11-03 11:05:03
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-03 15:54:56
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateUpdateLogDto {
  @ApiProperty({
    type: String,
    description: '设备唯一标识',
  })
  @IsNotEmpty()
  readonly uuid: string

  @ApiProperty({
    type: String,
    description: 'wgt版本名',
  })
  @IsNotEmpty()
  readonly wgtVersion: string

  @ApiProperty({
    type: Number,
    description: 'wgt版本号',
  })
  @IsNotEmpty()
  readonly wgtVersionCode: number

  @ApiProperty({
    type: String,
    description: '原生版本名',
  })
  @IsNotEmpty()
  readonly nativeVersion: string

  @ApiProperty({
    type: Number,
    description: '原生版本号',
  })
  @IsNotEmpty()
  readonly nativeVersionCode: number

  @ApiProperty({
    type: String,
    description: '接口提示信息',
  })
  // @IsNotEmpty()
  message: string

  @ApiProperty({
    type: String,
    description: '接口提示状态码',
  })
  // @IsNotEmpty()
  statusCode: number
}
