import { PrimaryColumn, Column } from 'typeorm'

export class BaseEntity {
  @PrimaryColumn({
    type: 'bigint',
    name: 'id',
    nullable: false,
    unsigned: true,
    comment: 'ID',
  })
  id: string

  @Column({
    type: 'char',
    name: 'status',
    nullable: false,
    default: '0',
    length: 1,
    comment: '状态（0正常 1停用）',
  })
  status: string

  @Column({
    type: 'varchar',
    length: 36,
    name: 'create_by',
    default: '',
    nullable: true,
    comment: '创建者',
  })
  createdBy: string

  @Column({
    type: 'timestamp',
    name: 'created_time',
    default: null,
    nullable: true,
    comment: '创建时间',
  })
  createdTime: Date

  @Column({
    type: 'varchar',
    length: 36,
    name: 'updated_by',
    default: '',
    nullable: true,
    comment: '更新者',
  })
  updatedBy: string

  @Column({
    type: 'timestamp',
    name: 'updated_time',
    default: null,
    nullable: true,
    comment: '更新时间',
  })
  updatedTime: Date

  @Column({
    type: 'varchar',
    length: 500,
    name: 'remark',
    default: '',
    nullable: true,
    comment: '备注',
  })
  remark: string
}
