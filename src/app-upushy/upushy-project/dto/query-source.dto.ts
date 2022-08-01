/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-07 15:53:19
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 14:27:28
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class QuerySourceDto {
  @ApiProperty({
    description: '项目ID',
    type: String,
  })
  @Length(8, 32)
  @IsNotEmpty()
  readonly projectId: string
}
