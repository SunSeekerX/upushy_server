/**
 * 基础id DTO
 * @author: SunSeekerX
 * @Date: 2021-11-27 22:12:58
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-11-28 13:33:33
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class BaseIdDto {
  @ApiProperty({
    type: String,
    description: 'id',
    example: '373436458528280576',
    required: true,
  })
  @IsNumberString()
  @IsNotEmpty()
  readonly id: string
}
