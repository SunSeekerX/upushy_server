/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-26 11:39:50
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-04-28 00:18:21
 */

// Base response
export interface ResponseRO {
  // Is request success?
  success: boolean

  // Message
  message: string

  // Response code
  statusCode: number

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

// Pagination response
export interface PaginationRO extends ResponseRO {
  // Response content
  data?: PaginationData<unknown>
}
