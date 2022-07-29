/**
 * 统一响应
 * @author: SunSeekerX
 * @Date: 2020-06-26 11:39:50
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-12 22:01:50
 */

import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger';

/**
 * 基础响应接口
 */
export interface BaseResult {
  // Response statusCode
  statusCode: HttpStatus | number

  // Message
  message: string

  // Response content
  data?: Record<string, any> | string | number

  // Response error
  error?: string

  // Response errors
  errors?: Array<string>

  // Version
  version?: string

  // timestamp
  timestamp?: string
}

interface PaginationData<T> {
  total: number

  records: Array<T>
}

/**
 * 分页响应接口
 */
export interface PagingResult<T> extends BaseResult {
  // Response content
  data?: PaginationData<T>
}
