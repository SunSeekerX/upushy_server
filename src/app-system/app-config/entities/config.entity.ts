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
export class ConfigEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    name: 'config_key',
    nullable: false,
    unsigned: true,
    unique: true,
    comment: '配置键名',
  })
  configKey: string

  @Column({
    type: 'char',
    name: 'config_value',
    nullable: true,
    unsigned: true,
    length: 2,
    comment: '配置值',
  })
  configValue: string
}
