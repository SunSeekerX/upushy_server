import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class QueryLatestNativeVersionDto {
  @ApiProperty({
    type: String,
    description: '项目ID',
  })
  @Length(10, 32)
  @IsNotEmpty()
  readonly projectId: string
}
