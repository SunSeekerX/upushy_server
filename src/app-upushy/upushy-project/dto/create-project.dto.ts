/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-07-04 18:11:03
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 22:27:18
 */

import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, ValidateIf } from 'class-validator'

export class CreateProjectDto {
  // 用户id
  userId?: string

  @ApiProperty({
    type: String,
    description: '项目名称',
    example: '美团团',
  })
  @IsNotEmpty()
  readonly name: string

  @ApiProperty({
    type: String,
    description: '项目描述',
    default: '',
    example: '美团团是一家面向本地消费产品和零售服务（包括娱乐，餐饮，送货，旅行和其他服务）的中文购物平台',
  })
  @ValidateIf((o) => ![null, undefined].includes(o.describe))
  readonly describe: string
}
