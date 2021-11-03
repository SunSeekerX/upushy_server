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
import { ServeStaticModule } from '@nestjs/serve-static'
import { join } from 'path'

import { getEnv } from 'src/shared/config'
import { EnvType } from 'src/shared/enums'

import { LogInterceptor } from 'src/shared/interceptor'

import { AppController } from './app.controller'
import { UserModule } from './user/user.module'
import { ProjectModule } from './project/project.module'
import { SourceModule } from './source/source.module'
import { LogModule } from './log/log.module'
import { CacheModule } from './cache/cache.module'
import { BasicModule } from './basic/basic.module'
// import { ApiSignMiddleware } from 'src/shared/middleware'

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
      exclude: ['/api*'],
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
        // 不配置这个 emoji 无法保存
        charset: 'utf8mb4_general_ci',
      },
    }),
    UserModule,
    ProjectModule,
    SourceModule,
    LogModule,
    CacheModule,
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
//     consumer.apply(ApiSignMiddleware).exclude({ path: `/${getEnv<string>('API_GLOBAL_PREFIX', EnvType.string)}/basic/update`, method: RequestMethod.POST }).forRoutes('*')
//   }
// }
