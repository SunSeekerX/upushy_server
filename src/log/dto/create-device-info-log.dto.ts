/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-11-03 11:12:20
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-02-19 11:25:43
 */

import { ApiProperty } from '@nestjs/swagger'

export class CreateDeviceInfoLogDto {
  @ApiProperty({
    type: String,
    description: '设备唯一标识',
  })
  readonly uuid?: string

  // @ApiProperty({
  //   type: String,
  //   description: '原生版本名',
  // })
  // readonly nativeVersion: string

  @ApiProperty({
    type: String,
    description: '手机品牌',
  })
  readonly brand: string

  @ApiProperty({
    type: String,
    description: '手机型号',
  })
  readonly model: string

  @ApiProperty({
    type: Number,
    description: '像素密度',
  })
  readonly pixelRatio: number

  @ApiProperty({
    type: Number,
    description: '屏幕宽度',
  })
  readonly screenWidth: number

  @ApiProperty({
    type: Number,
    description: '屏幕高度',
  })
  readonly screenHeight: number

  @ApiProperty({
    type: Number,
    description: '窗口宽度',
  })
  readonly windowWidth: number

  @ApiProperty({
    type: Number,
    description: '窗口高度',
  })
  readonly windowHeight: number

  @ApiProperty({
    type: Number,
    description: '状态栏高度',
  })
  readonly statusBarHeight: number

  @ApiProperty({
    type: String,
    description: '语言',
  })
  readonly language: string

  @ApiProperty({
    type: String,
    description: '系统',
  })
  readonly system: string

  @ApiProperty({
    type: String,
    description: '版本',
  })
  readonly version: string

  @ApiProperty({
    type: String,
    description: '字体尺寸',
  })
  readonly fontSizeSetting: string

  @ApiProperty({
    type: String,
    description: '平台',
  })
  readonly platform: string

  @ApiProperty({
    type: String,
    description: 'SDK版本',
  })
  readonly SDKVersion: string

  @ApiProperty({
    type: Number,
    description: 'windowTop',
  })
  readonly windowTop: number

  @ApiProperty({
    type: Number,
    description: 'windowBottom',
  })
  readonly windowBottom: number
}
