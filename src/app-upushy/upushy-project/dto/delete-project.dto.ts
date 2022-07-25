/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 18:37:28
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 14:27:20
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class DeleteProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(32, 36)
  readonly id: string
}
