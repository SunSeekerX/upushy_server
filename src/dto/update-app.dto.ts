/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-10 16:09:26
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-13 21:46:46
 */

import { ApiProperty } from '@nestjs/swagger'
import { Type  } from 'class-transformer'
import { IsNotEmpty, IsInt, Validate } from 'class-validator'
import { CustomPlatform } from './custom-platform'

export class UpdateAppDto {
  @ApiProperty({
    type: String,
    description: 'projectId',
  })
  @IsNotEmpty()
  readonly projectId: string

  @ApiProperty({
    type: String,
    description: '客户端平台',
  })
  @Validate(CustomPlatform)
  @IsNotEmpty()
  readonly platform: string

  @ApiProperty({
    type: Number,
    description: '版本',
  })
  readonly version?: string

  @ApiProperty({
    type: Number,
    description: '版本号',
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  readonly versionCode: number

  @ApiProperty({
    type: Number,
    description: '原生应用版本号',
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  readonly nativeVersionCode: number
}
