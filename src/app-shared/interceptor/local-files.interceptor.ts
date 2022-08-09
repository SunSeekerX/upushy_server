import { FileInterceptor } from '@nestjs/platform-express'
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'
import * as path from 'path'
import * as fs from 'fs'

interface LocalFilesInterceptorOptions {
  fieldName: string
  path?: string
  fileFilter?: MulterOptions['fileFilter']
  limits?: MulterOptions['limits']
}

export function LocalFilesInterceptor(options: LocalFilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor
    constructor() {
      const filesDestination = './static'

      const destination = `${filesDestination}${options.path}`

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination: (req, file, cb) => {
            const date = new Date()
            const years = date.getFullYear()
            const month = date.getMonth() + 1

            const filePath = `./static/upload/${years}-${month}/`
            //判断文件夹是否存在 不存在则创建
            fs.stat(filePath, (err, stats) => {
              if (!stats) {
                fs.mkdir(filePath, { recursive: true }, () => {
                  cb(null, filePath)
                }) //Create dir in case not found
              } else {
                cb(null, filePath)
              }
            })
          },
          filename(req, file, callback) {
            const dateNow = new Date()
            callback(null, dateNow.getTime() + path.extname(file.originalname).toLocaleLowerCase())
          },
        }),
        fileFilter: options.fileFilter,
        limits: options.limits,
      }

      this.fileInterceptor = new (FileInterceptor(options.fieldName, multerOptions))()
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args)
    }
  }
  return mixin(Interceptor)
}
