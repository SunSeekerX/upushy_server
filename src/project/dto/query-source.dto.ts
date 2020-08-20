/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-07 15:53:19
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-03 12:56:16
 */

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class QuerySourceDto {
  @ApiProperty({
    description: 'Project id',
    type: Number,
  })
  @Type(() => Number)
  @IsNotEmpty()
  readonly projectId: number
}
