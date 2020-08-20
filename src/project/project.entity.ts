/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:57:45
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-13 20:37:24
 */

import {
  Entity,
  PrimaryColumn,
  Generated,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('app_project')
export class ProjectEntity {
  @PrimaryColumn({
    comment: 'id',
  })
  @Generated('uuid')
  id: string

  @Column({
    type: 'varchar',
    comment: '用户id',
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
    default: ''
  })
  describe: string

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
