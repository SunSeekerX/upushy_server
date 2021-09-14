/**
 * 统一响应
 * @author: SunSeekerX
 * @Date: 2020-06-26 11:39:50
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 18:22:39
 */

import { HttpStatus } from '@nestjs/common'

/**
 * 基础响应接口
 */
export interface BaseResult {
  // Is request success?
  // success: boolean

  // Response code
  code: HttpStatus | number

  // Message
  message: string

  // Response content
  data?: Record<string, any> | string | number

  // Response errors
  errors?: Array<string>

  // Version
  version?: string | null
}

interface PaginationData<T> {
  total: number

  records: Array<T>
}

/**
 * 分页响应接口
 */
export interface PagingResult extends BaseResult {
  // Response content
  data?: PaginationData<unknown>
}
