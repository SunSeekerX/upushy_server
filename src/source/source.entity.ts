/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 17:59:01
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 16:14:54
 */

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from 'typeorm'

import { guid } from 'src/shared/utils'

@Entity('app_source')
export class SourceEntity {
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
    name: 'project_id',
    length: 36,
    nullable: false,
    comment: '项目id',
  })
  projectId: string

  @Column({
    type: 'varchar',
    comment: '版本',
  })
  version: string

  @Column({
    type: 'int',
    name: 'version_code',
    nullable: false,
    unsigned: true,
    comment: '版本号',
  })
  versionCode: number

  @Column({
    type: 'int',
    name: 'native_version_code',
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

  // @Column({
  //   type: 'int',
  //   name: 'is_force_update',
  //   unsigned: true,
  //   nullable: false,
  //   comment: '是否强制更新（0：否 1：是）',
  // })
  // isForceUpdate: number

  @Column({
    type: 'int',
    name: 'update_type',
    unsigned: true,
    nullable: false,
    default: 1,
    comment: '更新类型（1：用户同意更新，2：强制更新，3：静默更新）',
  })
  updateType: number

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
    default: '',
  })
  remark: string

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
