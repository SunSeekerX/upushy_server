/**
 * 项目实体
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:57:45
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 18:15:19
 */

import { Entity, Column } from 'typeorm'

import { BaseEntity } from 'src/app-shared/base'

@Entity('app_project')
export class ProjectEntity extends BaseEntity {
  @Column({
    type: 'bigint',
    name: 'user_id',
    nullable: false,
    unsigned: true,
    comment: 'ID',
  })
  userId: string

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '应用名',
  })
  name: string

  @Column({
    type: 'varchar',
    comment: '应用描述',
    default: '',
  })
  describe: string
}
