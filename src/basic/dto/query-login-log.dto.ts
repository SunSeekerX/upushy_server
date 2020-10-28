/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 17:06:13
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 17:17:48
 */
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { ValidateIf, IsInt } from 'class-validator'

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
}
