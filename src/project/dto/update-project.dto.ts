/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 18:19:03
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 14:27:38
 */

import { ApiProperty } from '@nestjs/swagger'
import { ValidateIf, IsNotEmpty, Length } from 'class-validator'

export class UpdateProjectDto {
  @ApiProperty({
    type: String,
    description: '项目id',
  })
  @Length(32, 36)
  @IsNotEmpty()
  readonly id: string

  @ApiProperty({
    type: String,
    description: '项目名称',
  })
  @ValidateIf(o => ![null, undefined].includes(o.name))
  readonly name?: string

  @ApiProperty({
    type: String,
    description: '项目描述',
  })
  @ValidateIf(o => ![null, undefined].includes(o.describe))
  readonly describe?: string
}
