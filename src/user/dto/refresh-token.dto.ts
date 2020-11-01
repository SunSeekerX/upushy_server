/**
 * @name: 
 * @author: SunSeekerX
 * @Date: 2020-11-01 18:25:55
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-01 18:27:49
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class RefreshTokenDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly refreshToken: string
}
