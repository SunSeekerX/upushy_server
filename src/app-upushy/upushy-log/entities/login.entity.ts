/**
 * 登录日志实体
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:06:19
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:21:30
 */

import { Entity, Column } from 'typeorm'

import { BaseEntity } from 'src/app-shared/base'

@Entity('app_log_login')
export class LoginLogEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    comment: '用户名',
  })
  username: string

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    comment: '登录IP地址',
  })
  ipaddr: string

  @Column({
    type: 'varchar',
    name: 'login_location',
    length: 255,
    default: '',
    comment: '登录地点',
  })
  loginLocation: string

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    comment: '浏览器类型',
  })
  browser: string

  @Column({
    type: 'varchar',
    length: 50,
    default: '',
    comment: '操作系统',
  })
  os: string

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    comment: '提示消息',
  })
  msg: string
}
