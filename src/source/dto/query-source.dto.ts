/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-07 15:25:02
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 14:27:53
 */

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import {
  IsNotEmpty,
  ValidateIf,
  IsInt,
  Validate,
  Length,
} from 'class-validator'
import { CustomOrder } from 'src/shared/validator/custom-order'

export class QuerySourceDto {
  @ApiProperty({
    description: '项目ID',
    type: String,
  })
  @Length(32, 36)
  @IsNotEmpty()
  readonly projectId: string

  @ApiProperty({
    description: '资源类型（1：wgt-android 2：wgt-ios  3：android，4：ios）',
    type: Number,
  })
  @Type(() => Number)
  @IsNotEmpty()
  readonly type?: number

  @ApiProperty({
    type: Number,
    description: '页码',
  })
  @Type(() => Number)
  @ValidateIf(o => o.pageNum)
  @IsInt()
  readonly pageNum?: number

  @ApiProperty({
    type: Number,
    description: '条数',
  })
  @Type(() => Number)
  @ValidateIf(o => o.pageNum)
  @IsInt()
  readonly pageSize?: number

  @ApiProperty({
    type: String,
    description: '排序的key',
  })
  @ValidateIf(o => o.sortKey)
  readonly sortKey?: string

  @ApiProperty({
    type: String,
    description: '排序的方式: ASC, DESC',
  })
  @Validate(CustomOrder)
  @ValidateIf(o => o.sortKey)
  readonly order?: string
}
