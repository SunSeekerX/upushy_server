/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-06 11:03:12
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 13:17:57
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class DeleteSourceDto {
  @ApiProperty({
    description: '资源ID',
    type: String,
  })
  @Length(32, 36)
  @IsNotEmpty()
  readonly id: string
}
