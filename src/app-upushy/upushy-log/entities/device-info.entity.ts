/**
 * 设备信息日志实体
 * @author: SunSeekerX
 * @Date: 2021-02-09 13:28:49
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:21:39
 */

import { Entity, Column } from 'typeorm'

import { BaseEntity } from 'src/app-shared/base'

@Entity('app_log_device_info')
export class DeviceInfoLogEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 36,
    unique: true,
    nullable: false,
    comment: '设备唯一标识',
  })
  uuid: string

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    comment: '手机品牌',
  })
  brand: string

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    comment: '手机型号',
  })
  model: string

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
    comment: '像素密度',
  })
  pixelRatio: number

  @Column({
    type: 'int',
    name: 'screen_width',
    unsigned: true,
    default: 0,
    comment: '屏幕宽度',
  })
  screenWidth: number

  @Column({
    type: 'int',
    name: 'screen_height',
    unsigned: true,
    default: 0,
    comment: '屏幕高度',
  })
  screenHeight: number

  @Column({
    type: 'int',
    name: 'window_width',
    unsigned: true,
    default: 0,
    comment: '窗口宽度',
  })
  windowWidth: number

  @Column({
    type: 'int',
    name: 'window_height',
    unsigned: true,
    default: 0,
    comment: '窗口高度',
  })
  windowHeight: number

  @Column({
    type: 'int',
    name: 'status_bar_height',
    unsigned: true,
    default: 0,
    comment: '状态栏高度',
  })
  statusBarHeight: number

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    comment: '语言',
  })
  language: string

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    comment: '系统',
  })
  system: string

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    comment: '版本',
  })
  version: string

  @Column({
    type: 'varchar',
    name: 'font_size_setting',
    length: 50,
    default: '',
    comment: '字体尺寸',
  })
  fontSizeSetting: string

  @Column({
    type: 'varchar',
    length: 10,
    default: '',
    comment: '平台',
  })
  platform: string

  @Column({
    type: 'varchar',
    name: 'sdk_version',
    length: 10,
    default: '',
    comment: 'SDK版本',
  })
  SDKVersion: string

  @Column({
    type: 'int',
    name: 'window_top',
    unsigned: true,
    default: 0,
    comment: 'windowTop',
  })
  windowTop: number

  @Column({
    type: 'int',
    name: 'window_bottom',
    unsigned: true,
    default: 0,
    comment: 'windowBottom',
  })
  windowBottom: number
}
