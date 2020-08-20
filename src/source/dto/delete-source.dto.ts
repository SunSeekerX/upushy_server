/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-06 11:03:12
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-13 20:54:22
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class DeleteSourceDto {
  @ApiProperty({
    description: '资源ID',
    type: String,
  })
  @IsNotEmpty()
  readonly id: string
}
