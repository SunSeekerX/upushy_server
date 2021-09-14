/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 17:06:13
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:18:21
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
    example: null,
  })
  id?: number

  @ApiProperty({
    type: Number,
    description: '页码',
    required: false,
    example: 1,
  })
  @Type(() => Number)
  @ValidateIf((o) => o.pageNum)
  @IsInt()
  readonly pageNum: number

  @ApiProperty({
    type: Number,
    description: '条数',
    required: false,
    example: 100,
  })
  @Type(() => Number)
  @ValidateIf((o) => o.pageNum)
  @IsInt()
  readonly pageSize: number

  @ApiProperty({
    type: String,
    description: '排序的key',
    example: 'loginTime',
  })
  @ValidateIf((o) => o.sortKey)
  readonly sortKey?: string

  @ApiProperty({
    type: String,
    description: '排序的方式: ASC, DESC',
    example: 'DESC',
  })
  @Validate(CustomOrder)
  @ValidateIf((o) => o.sortKey)
  readonly order?: string
}
