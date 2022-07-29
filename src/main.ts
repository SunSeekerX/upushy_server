/**
 * 程序入口
 * @author: SunSeekerX
 * @Date: 2020-06-22 11:08:40
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 18:31:53
 */

import * as chalk from 'chalk'
import helmet from 'helmet'
import * as useragent from 'express-useragent'
import { NestFactory, HttpAdapterHost } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { v4 } from 'internal-ip'

import { AllExceptionsFilter } from 'src/app-shared/filter'
import { getEnv } from 'src/app-shared/config'
import { AppModule } from 'src/app.module'

const port = getEnv<number>('SERVER_PORT')
const globalPrefix = getEnv<string>('API_GLOBAL_PREFIX')
const ipv4 = v4.sync()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      // 白名单模式，建议设置，否则不存在于 dto 对象中的键值也会被使用
      whitelist: true,
      // 如果设置为true，尝试验证未知对象会立即失败
      forbidUnknownValues: true,
    })
  )
  // 错误过滤器
  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))
  app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  )
  app.setGlobalPrefix(globalPrefix)
  app.use(useragent.express())

  let docTips = ''
  let runningTips = `
    Server running at:
      - Local:   ${chalk.green(`http://localhost:${port}${globalPrefix}/`)}
      - Network: ${chalk.green(`http://${ipv4}:${port}${globalPrefix}/`)}
    Client running at:
      - Local:   ${chalk.green(`http://localhost:${port}/`)}
      - Network: ${chalk.green(`http://${ipv4}:${port}/`)}`

  if (getEnv('SERVER_DOC')) {
    const options = new DocumentBuilder().setTitle('upushy server').setVersion('1.0').addBearerAuth().build()
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

bootstrap()
