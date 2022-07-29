import { ApiProperty } from '@nestjs/swagger'

import { BaseResult2, PaginationResult } from 'src/app-shared/base'

export class LatestNativeSourceVO2 {
  @ApiProperty({
    description: '安卓最新原生版本号',
    required: false,
  })
  android?: number

  @ApiProperty({
    description: 'ios 最新原生版本号',
    required: false,
  })
  ios?: number
}

export class LatestNativeSourceVO extends BaseResult2 {
  @ApiProperty({
    description: '安卓最新原生版本号',
    required: false,
    type: LatestNativeSourceVO2,
  })
  data: LatestNativeSourceVO2
}
