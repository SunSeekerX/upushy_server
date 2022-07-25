/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-11-03 11:59:55
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-03 12:16:57
 */

import { ApiProperty } from '@nestjs/swagger'
// import { IsNotEmpty } from 'class-validator'

export class QueryDeviceInfoDto {
  @ApiProperty({
    type: String,
    description: '设备唯一标识',
  })
  readonly uuid?: string
}
