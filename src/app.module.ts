/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-22 11:08:40
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-10 17:19:47
 */

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from 'nestjs-redis'

import { getEnv } from 'src/shared/utils/env'
import { EnvType } from 'src/shared/enum/index'

import { AppController } from './app.controller'
import { LogInterceptor } from 'src/shared/interceptor/log.interceptor'
import { VersionInterceptor } from 'src/shared/interceptor/version.interceptor'
import { SignMiddleware } from 'src/shared/middleware/sign.middleware'

import { UserModule } from './user/user.module'
import { ProjectModule } from './project/project.module'
import { SourceModule } from './source/source.module'
import { LogModule } from './log/log.module'

@Module({
  imports: [
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      db: parseInt(process.env.REDIS_DB),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_PREFIX,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: getEnv('DB_HOST', EnvType.string),
      port: getEnv('DB_PORT', EnvType.number),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity.js'],
      synchronize: !(process.env.DB_TABLE_SYNC === 'false'),
      logging: false,
      extra: {
        // If without this filed emoji can't be stored
        charset: 'utf8mb4_general_ci',
      },
    }),
    UserModule,
    ProjectModule,
    SourceModule,
    LogModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: VersionInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(SignMiddleware)
      .exclude(
        { path: '/api/update', method: RequestMethod.POST }
        // { path: '/api/config/system', method: RequestMethod.GET },
      )
      .forRoutes(AppController)
  }
}
