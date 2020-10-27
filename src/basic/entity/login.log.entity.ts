/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:06:19
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 00:48:26
 */

import {
  Entity,
  Generated,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { CreateLoginLogDto } from '../dto/create-login-log.dto'

@Entity('sys_login_log')
export class LoginLogEntity {
  // constructor({
  //   username,
  //   ipaddr,
  //   loginLocation,
  //   browser,
  //   os,
  //   status,
  //   msg,
  //   loginTime,
  // }: CreateLoginLogDto) {
  //   this.username = username
  //   this.ipaddr = ipaddr
  //   this.loginLocation = loginLocation
  //   this.browser = browser
  //   this.os = os
  //   this.status = status
  //   this.msg = msg
  //   this.loginTime = loginTime
  // }

  @PrimaryColumn({
    comment: 'id',
  })
  @Generated('uuid')
  id: string

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
    name: 'login_location',
    type: 'varchar',
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
    type: 'char',
    length: 1,
    default: 0,
    comment: '登录状态（0成功 1失败）',
  })
  status: string

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    comment: '提示消息',
  })
  msg: string

  @Column({
    name: 'login_time',
    type: 'timestamp',
    comment: '访问时间',
  })
  loginTime: Date

  @CreateDateColumn({
    name: 'created_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: '创建时间',
  })
  createdTime: Date

  @UpdateDateColumn({
    name: 'updated_time',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: '更新时间',
  })
  updatedTime: Date
}
