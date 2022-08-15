import { Entity, Column } from 'typeorm'

import { BaseEntity } from 'src/app-shared/base'

@Entity('app_source')
export class SourceEntity extends BaseEntity {
  @Column({
    type: 'bigint',
    name: 'project_id',
    nullable: false,
    unsigned: true,
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

  @Column({
    type: 'int',
    name: 'update_type',
    unsigned: true,
    nullable: false,
    default: 1,
    comment: '更新类型 1 用户同意更新 2 强制更新 3 静默更新',
  })
  updateType: number

  @Column({
    type: 'int',
    name: 'upload_type',
    unsigned: true,
    nullable: false,
    default: 1,
    comment: '上传类型 1 本地上传 2 阿里云 oss',
  })
  uploadType: number

  @Column({
    type: 'int',
    unsigned: true,
    comment: '资源类型 1 wgt-android 2 wgt-ios  3 android 4 ios',
  })
  type: number

  @Column({
    type: 'varchar',
    comment: '更新日志',
    nullable: false,
    default: '',
  })
  changelog: string
}
