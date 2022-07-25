import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, Length } from 'class-validator'

export class QueryLatestNativeVersionDto {
  @ApiProperty({
    type: String,
    description: '项目ID',
  })
  @Length(32, 36)
  @IsNotEmpty()
  readonly projectId: string
}
