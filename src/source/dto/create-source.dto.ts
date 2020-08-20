/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-06 10:21:53
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-18 17:49:55
 */

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsInt, Min, MaxLength} from 'class-validator'

export class CreateSourceDto {
  @ApiProperty({
    type: String,
    description: '项目ID',
  })
  @IsNotEmpty()
  readonly projectId: string

  @ApiProperty({
    type: String,
    description: '版本',
  })
  @IsNotEmpty()
  readonly version: string

  @ApiProperty({
    type: Number,
    description: '版本号',
  })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  @IsNotEmpty()
  readonly versionCode: number

  @ApiProperty({
    type: Number,
    description: '原生应用版本号',
  })
  @Type(() => Number)
  @IsInt()
  readonly nativeVersionCode: number

  @ApiProperty({
    type: String,
    description: '下载地址',
  })
  @IsNotEmpty()
  readonly url: string

  @ApiProperty({
    type: Number,
    description: '是否强制更新（0：否 1：是）',
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  readonly isForceUpdate: number

  @ApiProperty({
    type: Number,
    description: '资源类型（1：wgt-android 2：wgt-ios  3：android，4：ios）',
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsInt()
  readonly type: number

  @ApiProperty({
    type: Number,
    description: '资源状态（0：禁用 1：启用）',
  })
  @Type(() => Number)
  @IsInt()
  readonly status?: number

  @ApiProperty({
    type: String,
    description: '更新日志',
  })
  @MaxLength(255)
  @IsNotEmpty()
  readonly changelog: string

  @ApiProperty({
    type: String,
    description: '备注',
  })
  @MaxLength(255)
  readonly remark?: string
}
