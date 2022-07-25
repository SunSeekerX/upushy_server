/**
 * 用户实体
 * @author: SunSeekerX
 * @Date: 2020-06-22 12:09:26
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:47:26
 */

import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn, BeforeInsert } from 'typeorm'
import * as argon2 from 'argon2'
import { guid } from 'src/app-shared/utils'

@Entity('app_user')
export class UserEntity {
  @PrimaryColumn({
    type: 'varchar',
    length: 36,
    nullable: false,
    comment: 'id',
  })
  id: string

  @BeforeInsert()
  updateId(): void {
    this.id = guid()
  }

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
    comment: '邮箱',
    nullable: true,
  })
  email?: string

  @Column({
    comment: '昵称',
    nullable: true,
  })
  nickname?: string

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
