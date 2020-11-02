/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:57:45
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 15:20:56
 */

import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm'

import { guid } from 'src/shared/utils'

@Entity('app_project')
export class ProjectEntity {
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
    name: 'user_id',
    length: 36,
    nullable: false,
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
    default: '',
  })
  describe: string

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
