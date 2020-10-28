/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:06:19
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 22:25:13
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('sys_login_log')
export class LoginLogEntity {
  @PrimaryGeneratedColumn({
    comment: 'id',
    unsigned: true,
  })
  id: number

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
    comment: '登录日期',
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
