import { HttpStatus } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'

class PaginationData<T> {
  // 总条数
  @ApiProperty({
    description: '总条数',
    required: true,
  })
  total: number

  // 数据列表
  @ApiProperty({
    description: '数据列表',
  })
  records: Array<T>
}

class Result {
  // Response statusCode
  @ApiProperty({
    description: '状态码',
    required: true,
  })
  statusCode: HttpStatus | number

  // Message
  @ApiProperty({
    description: '响应信息',
    required: true,
  })
  message: string

  // Response error
  @ApiProperty({
    description: '错误信息',
    required: false,
  })
  error?: string

  // Response errors
  @ApiProperty({
    description: '错误信息',
    required: false,
  })
  errors?: Array<string>

  // Version
  @ApiProperty({
    description: '版本',
    required: false,
  })
  version?: string

  // timestamp
  @ApiProperty({
    description: '时间戳',
    required: false,
  })
  timestamp?: string
}

/**
 * 基础响应
 */
export class BaseResult<T> extends Result {
  // Response content
  @ApiProperty({
    description: '响应体',
    required: false,
    // type: Type<T>,
  })
  data?: T
}

export abstract class BaseResult2 extends Result {
  abstract data: unknown
}

/**
 * 分页响应
 */
export class PaginationResult<T> extends Result {
  // Response content
  @ApiProperty({
    description: '响应体',
    required: true,
    // type: () => T,
  })
  data: PaginationData<T>
}
