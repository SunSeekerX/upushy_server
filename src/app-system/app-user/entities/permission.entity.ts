/**
 * 用户权限表实体
 * @author: SunSeekerX
 * @Date: 2020-06-22 12:09:26
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 17:47:26
 */

import { Entity, Column } from 'typeorm'

import { BaseEntity } from 'src/app-shared/base'

@Entity({
  name: 'app_user_permission',
  engine: 'InnoDB',
})
export class UserPermissionEntity extends BaseEntity {
  @Column({
    type: 'bigint',
    name: 'user_id',
    nullable: false,
    unsigned: true,
    comment: '用户 id',
  })
  userId: string

  @Column({
    type: 'varchar',
    length: 1,
    comment: '权限字符',
  })
  permission: string
}
