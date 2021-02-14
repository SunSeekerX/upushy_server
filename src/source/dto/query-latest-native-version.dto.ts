/**
 * @name: 
 * @author: SunSeekerX
 * @Date: 2021-02-14 20:45:21
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-02-14 20:46:49
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class QueryLatestNativeVersionDto {
  @ApiProperty({
    type: String,
    description: '项目ID',
  })
  @Length(32, 36)
  @IsNotEmpty()
  readonly projectId: string
}
