import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'

import { BaseResult } from 'src/app-shared/interface'

@Controller('/system')
export class AppUploadController {
  // 文件上传
  // https://wanago.io/2021/11/08/api-nestjs-uploading-files-to-server/
  @Post('/upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static',
      }),
    })
  )
  async onUploadFile(@UploadedFile() file: Express.Multer.File): Promise<BaseResult> {
    console.log(file)
    return {
      statusCode: 200,
      message: '成功',
      data: {
        path: file?.path,
        filename: file?.originalname,
        mimetype: file?.mimetype,
      },
    }
  }
}
