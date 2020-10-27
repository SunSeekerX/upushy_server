/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-22 12:09:26
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-10-28 00:41:25
 */

import {
  Entity,
  PrimaryColumn,
  Generated,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm'
import * as argon2 from 'argon2'

@Entity('app_user')
export class UserEntity {
  @PrimaryColumn({
    comment: 'id',
  })
  @Generated('uuid')
  id: string

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

  @BeforeInsert()
  async hashPassword(): Promise<void | Error> {
    this.password = await argon2.hash(this.password)
  }

  @Column({
    type: 'varchar',
    length: 320,
    unique: true,
    comment: '邮箱',
  })
  email: string

  @Column({
    comment: '昵称',
  })
  nickname: string

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    comment: '创建时间',
  })
  createdTime: Date

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    comment: '更新时间',
  })
  updatedTime: Date
}
