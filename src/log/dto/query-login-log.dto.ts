/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 17:06:13
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-03 12:17:10
 */
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateIf, IsInt, Validate } from 'class-validator'
import { CustomOrder } from 'src/shared/validator/custom-order'

export class QueryLoginLogDto {
  @ApiProperty({
    type: Number,
    description: 'ID',
    required: false,
  })
  id?: number

  @ApiProperty({
    type: Number,
    description: '页码',
    required: false,
  })
  @Type(() => Number)
  @ValidateIf(o => o.pageNum)
  @IsInt()
  readonly pageNum: number

  @ApiProperty({
    type: Number,
    description: '条数',
    required: false,
  })
  @Type(() => Number)
  @ValidateIf(o => o.pageNum)
  @IsInt()
  readonly pageSize: number

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
