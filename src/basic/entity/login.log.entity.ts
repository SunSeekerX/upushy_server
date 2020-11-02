/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-10-28 00:06:19
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 15:12:55
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('app_login_log')
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
    type: 'char',
    length: 1,
    default: 1,
    comment: '登录状态（0失败 1成功）',
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
    type: 'timestamp',
    name: 'login_time',
    comment: '登录日期',
  })
  loginTime: Date

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_time',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: '创建时间',
  })
  createdTime: Date

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_time',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: '更新时间',
  })
  updatedTime: Date
}
