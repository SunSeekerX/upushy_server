/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:59:01
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-18 18:07:15
 */

import {
  Entity,
  PrimaryColumn,
  Generated,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('app_source')
export class SourceEntity {
  @PrimaryColumn({
    comment: 'id',
  })
  @Generated('uuid')
  id: string

  @Column({
    type: 'varchar',
    comment: '项目id',
  })
  projectId: string

  @Column({
    type: 'varchar',
    length: 10,
    comment: '版本',
  })
  version: string

  @Column({
    unsigned: true,
    nullable: false,
    comment: '版本号',
  })
  versionCode: number

  @Column({
    type: 'int',
    unsigned: true,
    comment: '原生应用版本号',
    default: 0,
  })
  nativeVersionCode: number

  @Column({
    type: 'varchar',
    nullable: false,
    comment: '下载地址',
  })
  url: string

  @Column({
    type: 'int',
    unsigned: true,
    nullable: false,
    comment: '是否强制更新（0：否 1：是）',
  })
  isForceUpdate: number

  @Column({
    type: 'int',
    unsigned: true,
    comment: '资源类型（1：wgt-android 2：wgt-ios  3：android，4：ios）',
  })
  type: number

  @Column({
    type: 'int',
    unsigned: true,
    default: 1,
    comment: '资源状态（0：禁用 1：启用）',
  })
  status: number

  @Column({
    type: 'varchar',
    comment: '更新日志',
    nullable: false,
    default: '',
  })
  changelog: string

  @Column({
    type: 'varchar',
    comment: '备注',
  })
  remark: string

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
