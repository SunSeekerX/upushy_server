/**
 * 应用程序模块
 * @author: SunSeekerX
 * @Date: 2020-06-22 11:08:40
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2021-09-14 21:59:31
 */

import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'

import { getEnv } from 'src/app-shared/config'

import { LogInterceptor } from 'src/shared/interceptor'

/**
 * 系统模块
 */
import { AppCacheModule } from 'src/app-system/app-cache/app-cache.module'
import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { ProjectModule } from './project/project.module'
import { SourceModule } from './source/source.module'
import { LogModule } from './log/log.module'
import { BasicModule } from './basic/basic.module'
// import { ApiSignMiddleware } from 'src/shared/middleware'

@Module({
  imports: [
    AppCacheModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: getEnv('DB_HOST'),
      port: getEnv('DB_PORT'),
      username: getEnv('DB_USER'),
      password: getEnv('DB_PASSWORD'),
      database: getEnv('DB_DATABASE'),
      entities: ['dist/**/*.entity.js'],
      synchronize: getEnv('DB_TABLE_SYNC'),
      logging: false,
      extra: {
        // 不配置这个 emoji 无法保存
        charset: 'utf8mb4_general_ci',
      },
    }),
    UserModule,
    ProjectModule,
    SourceModule,
    LogModule,
    BasicModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(ApiSignMiddleware).exclude({ path: `/${getEnv<string>('API_GLOBAL_PREFIX')}/basic/update`, method: RequestMethod.POST }).forRoutes('*')
//   }
// }
