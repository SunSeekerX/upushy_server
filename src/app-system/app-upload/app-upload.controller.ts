import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { ApiOperation, ApiTags, ApiBearerAuth, ApiResponse } from '@nestjs/swagger'

import { getEnv } from 'src/app-shared/config'
import { BaseResult } from 'src/app-shared/interface'
import { LocalFilesInterceptor } from 'src/app-shared/interceptor'

const serverUploadLimitMb = getEnv<number>('SERVER_UPLOAD_LIMIT')

@ApiBearerAuth()
@ApiTags('系统模块 - 文件上传')
@Controller('/system')
export class AppUploadController {
  // 文件上传
  // https://wanago.io/2021/11/08/api-nestjs-uploading-files-to-server/
  @Post('/upload')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '',
      // fileFilter: (request, file, callback) => {
      //   if (!file.mimetype.includes('image')) {
      //     return callback(new BadRequestException('Provide a valid image'), false)
      //   }
      //   callback(null, true)
      // },
      limits: {
        fileSize: serverUploadLimitMb * 1024 * 1024, // 1MB
      },
    })
  )
  async onUploadFile(@UploadedFile() file: Express.Multer.File): Promise<BaseResult> {
    if (file) {
      const destination = file.destination.replaceAll('./static', '')
      const fileName = file.filename
      return {
        statusCode: 200,
        message: '成功',
        data: `${destination}${fileName}`,
      }
    } else {
      return {
        statusCode: 400,
        message: '未找到文件',
      }
    }
  }
}
