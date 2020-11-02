/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-08-01 21:37:30
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 13:05:52
 */

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateIf, IsInt, Length } from 'class-validator'

export class QueryProjectDto {
  // @ApiProperty({
  //   type: String,
  //   description: '用户id',
  // })
  // @Length(8, 8)
  // 用户id
  userId?: string
  
  @ApiProperty({
    type: Number,
    description: '页码',
  })
  @Type(() => Number)
  @ValidateIf(o => o.pageNum)
  @IsInt()
  readonly pageNum: number

  @ApiProperty({
    type: Number,
    description: '条数',
  })
  @Type(() => Number)
  @ValidateIf(o => o.pageNum)
  @IsInt()
  readonly pageSize: number
}
