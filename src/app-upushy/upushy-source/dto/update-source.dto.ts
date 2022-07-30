import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty, IsInt, Min, MaxLength, ValidateIf, Length } from 'class-validator'

export class UpdateSourceDto {
  @ApiProperty({
    type: String,
    description: '资源ID',
  })
  @Length(10, 32)
  @IsNotEmpty()
  readonly id: string

  @ApiProperty({
    type: String,
    description: '版本',
  })
  readonly version?: string

  @ApiProperty({
    type: Number,
    description: '版本号',
  })
  @Type(() => Number)
  @Min(1)
  @IsInt()
  @ValidateIf(o => ![null, undefined].includes(o.versionCode))
  readonly versionCode?: number

  @ApiProperty({
    type: Number,
    description: '原生应用版本号',
  })
  @Type(() => Number)
  @IsInt()
  @ValidateIf(o => ![null, undefined].includes(o.nativeVersionCode))
  readonly nativeVersionCode?: number

  // @ApiProperty({
  //   type: String,
  //   description: '下载地址',
  // })
  // readonly url?: string

  @ApiProperty({
    type: Number,
    description: '是否强制更新（0：否 1：是）',
  })
  @Type(() => Number)
  @IsInt()
  @ValidateIf(o => ![null, undefined].includes(o.isForceUpdate))
  readonly isForceUpdate?: number

  @ApiProperty({
    type: Number,
    description: '更新类型（1：用户同意更新，2：强制更新，3：静默更新）',
  })
  @Type(() => Number)
  @IsInt()
  @ValidateIf(o => ![null, undefined].includes(o.updateType))
  readonly updateType?: number

  // @ApiProperty({
  //   type: Number,
  //   description: '资源类型（1：wgt-android 2：wgt-ios  3：android，4：ios）',
  // })
  // @Type(() => Number)
  // @IsInt()
  // @ValidateIf(o => ![null, undefined].includes(o.type))
  // readonly type?: number

  @ApiProperty({
    type: Number,
    description: '资源状态（0：禁用 1：启用）',
  })
  @Type(() => Number)
  @IsInt()
  @ValidateIf(o => ![null, undefined].includes(o.status))
  readonly status?: number

  @ApiProperty({
    type: String,
    description: '更新日志',
  })
  @MaxLength(255)
  @IsNotEmpty()
  @ValidateIf(o => ![null, undefined].includes(o.changelog))
  readonly changelog?: string

  @ApiProperty({
    type: String,
    description: '备注',
  })
  @MaxLength(255)
  @ValidateIf(o => ![null, undefined].includes(o.remark))
  readonly remark?: string
}
