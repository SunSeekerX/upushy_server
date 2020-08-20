/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-26 11:39:50
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-01 21:04:15
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
  data?: object

  // Response errors
  errors?: Array<string>
}

interface PaginationData<T> {
  total: number, 

  records: Array<T>
}

// Pagination response
export interface PaginationRO {
  // Is request success?
  success: boolean

  // Message
  message: string

  // Response code
  statusCode: number

  // Response content
  data?: PaginationData<Object>

  // Response errors
  errors?: Array<string>
}
