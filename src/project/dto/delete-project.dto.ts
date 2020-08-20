/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 18:37:28
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-13 20:41:18
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class DeleteProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly id: string
}
