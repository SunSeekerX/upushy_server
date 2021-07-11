/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-22 11:08:40
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-07-11 12:51:54
 */

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RedisModule } from 'nestjs-redis'
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
    }),
    RedisModule.register({
      host: getEnv('REDIS_HOST', EnvType.string),
      port: getEnv('REDIS_PORT', EnvType.number),
      db: getEnv('REDIS_DB', EnvType.number),
      password: getEnv('REDIS_PASSWORD', EnvType.string),
      keyPrefix: getEnv('REDIS_PREFIX', EnvType.string),
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: getEnv('DB_HOST', EnvType.string),
      port: getEnv('DB_PORT', EnvType.number),
      username: getEnv('DB_USER', EnvType.string),
      password: getEnv('DB_PASSWORD', EnvType.string),
      database: getEnv('DB_DATABASE', EnvType.string),
      entities: ['dist/**/*.entity.js'],
      synchronize: getEnv('DB_TABLE_SYNC', EnvType.boolean),
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
