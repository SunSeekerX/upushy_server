import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class CreateUserPermissionDto {
  @ApiProperty()
  @IsNotEmpty()
  userId: string

  @ApiProperty()
  @IsNotEmpty()
  permission: string
}
