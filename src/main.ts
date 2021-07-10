/**
 * @name: 项目入口
 * @author: SunSeekerX
 * @Date: 2020-06-22 11:08:40
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-10 17:59:08
 */

import 'src/shared/utils/bootstrap'
import { onValidateLocalEnvFile, getEnv } from 'src/shared/utils/env'
import * as chalk from 'chalk'
import * as helmet from 'helmet'
import * as useragent from 'express-useragent'
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import * as internalIp from 'internal-ip'
const ipv4 = internalIp.v4.sync()

import { AppModule } from './app.module'
import { EnvType } from './shared/enum'
// import { SignMiddleware } from 'src/shared/middleware/sign.middleware'
// import { ValidationPipe } from 'src/shared/pipes/validation.pipe'
// import { logger } from 'src/shared/middleware/logger.middleware'

const port = getEnv<number>('SERVER_PORT', EnvType.number)

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      // 白名单模式，必须设置，否则不存在于dto对象中的键值也会被使用
      whitelist: true,
      // forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
        // excludeExtraneousValues: true,
      },
    })
  )
  // app.use(logger)
  // app.use(SignMiddleware)
  app.use(helmet())
  app.setGlobalPrefix('api')
  app.use(useragent.express())

  let docTips = ''
  let runningTips = `
    App running at:
    - Local:   ${chalk.green(`http://localhost:${port}/api/`)}
    - Network: ${chalk.green(`http://${ipv4}:${port}/api/`)}`

  if (getEnv<boolean>('PRO_DOC')) {
    const options = new DocumentBuilder().setTitle('uni-pushy server').setVersion('1.0').addBearerAuth().build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('/docs', app, document)

    docTips = `
    Docs running at:
    - Local:   ${chalk.green(`http://localhost:${port}/docs/`)}
    - Network: ${chalk.green(`http://${ipv4}:${port}/docs/`)}`

    runningTips = runningTips + docTips
  }

  await app.listen(port, '0.0.0.0', () => {
    console.log(runningTips)
  })
}

/**
 * 验证本地载入的环境变量配置
 */
onValidateLocalEnvFile()

bootstrap()
