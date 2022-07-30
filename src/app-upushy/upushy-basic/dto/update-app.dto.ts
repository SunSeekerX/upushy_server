/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-10 16:09:26
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-03 15:48:03
 */

import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsInt, Validate, Length, ValidateNested } from 'class-validator'

import { CreateDeviceInfoLogDto } from 'src/app-upushy/upushy-log/dto'
import { CustomPlatform } from './custom-platform'

export class UpdateAppDto {
  @ApiProperty({
    type: String,
    description: 'projectId',
  })
  @Length(10, 32)
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
    type: String,
    description: 'wgt版本名',
  })
  @IsNotEmpty()
  readonly wgtVersion: string

  @ApiProperty({
    type: Number,
    description: 'wgt版本号',
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  readonly wgtVersionCode: number

  @ApiProperty({
    type: String,
    description: '原生版本名',
  })
  @IsNotEmpty()
  readonly nativeVersion: string

  @ApiProperty({
    type: Number,
    description: '原生应用版本号',
  })
  @Type(() => Number)
  @IsInt()
  @IsNotEmpty()
  readonly nativeVersionCode: number

  @ApiProperty({
    type: CreateDeviceInfoLogDto,
    description: '系统信息',
  })
  // @ValidateNested()
  readonly systemInfo: CreateDeviceInfoLogDto
}
