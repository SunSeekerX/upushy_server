/**
 * 统一响应
 * @author: SunSeekerX
 * @Date: 2020-06-26 11:39:50
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 20:50:00
 */

import { HttpStatus } from '@nestjs/common'

/**
 * 基础响应接口
 */
export interface BaseResult {
  success?: boolean
  statusCode: HttpStatus | number
  message: string
  data?: Record<string, any> | string | number
  errors?: Array<string>
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
  data?: PaginationData<unknown>
}
