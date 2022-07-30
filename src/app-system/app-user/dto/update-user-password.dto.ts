import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsHash } from 'class-validator'

export class UpdateUserPasswordDto {
  @ApiProperty({
    type: String,
    description: '原密码',
  })
  @IsNotEmpty()
  @IsHash('md5')
  readonly password: string

  @ApiProperty({
    type: String,
    description: '新密码',
  })
  @IsNotEmpty()
  @IsHash('md5')
  readonly newPassword: string
}
