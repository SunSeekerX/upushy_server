/**
 * 用户实体
 * @author: SunSeekerX
 * @Date: 2020-06-22 12:09:26
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:47:26
 */

import { Entity, Column } from 'typeorm'

import { BaseEntity } from 'src/app-shared/base'

@Entity('app_user')
export class UserEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    comment: '用户名',
  })
  username: string

  @Column({
    type: 'varchar',
    length: 200,
    comment: '密码',
  })
  password: string

  @Column({
    type: 'varchar',
    length: 320,
    comment: '邮箱',
    nullable: true,
  })
  email?: string

  @Column({
    comment: '昵称',
    nullable: true,
  })
  nickname?: string

  @Column({
    type: 'timestamp',
    name: 'updated_pwd_time',
    default: null,
    nullable: true,
    comment: '修改密码时间',
  })
  updatedPwdTime: Date
}
