/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-22 11:08:40
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-08-17 15:39:07
 */

import 'src/shared/utils/bootstrap'
import * as chalk from 'chalk'

import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
const internalIp = require('internal-ip')
const ipv4 = internalIp.v4.sync()

import { AppModule } from './app.module'
// import { SignMiddleware } from 'src/shared/middleware/sign.middleware'
// import { ValidationPipe } from 'src/shared/pipes/validation.pipe'
// import { logger } from 'src/shared/middleware/logger.middleware'

const port = process.env.SERVER_PORT || 3000

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
    }),
  )
  // app.use(logger)
  // app.use(SignMiddleware)
  // app.use(helmet())
  app.setGlobalPrefix('api')

  let docTips = ''

  if (process.env.PRO_DOC !== 'false') {
    const options = new DocumentBuilder()
      .setTitle('uni-pushy server')
      .setVersion('1.0')
      .addBearerAuth()
      .build()
    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup('/docs', app, document)

    docTips = `Docs running at:
    - Local:   ${chalk.green(`http://localhost:${port}/docs/`)}
    - Network: ${chalk.green(`http://${ipv4}:${port}/docs/`)}`
  }

  await app.listen(port)

  console.log(`
  App running at:
  - Local:   ${chalk.green(`http://localhost:${port}/api/`)}
  - Network: ${chalk.green(`http://${ipv4}:${port}/api/`)}
  ${docTips}
  `)
}

bootstrap()
