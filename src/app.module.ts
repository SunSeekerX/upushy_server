import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'

import { getEnv } from 'src/app-shared/config'

import { LogInterceptor } from 'src/app-shared/interceptor'

/**
 * 系统模块
 */
import { AppCacheModule } from 'src/app-system/app-cache/app-cache.module'
// import { AppController } from './app.controller'
import { AppUserModule } from './app-system/app-user/app-user.module'
import { UpushyProjectModule } from './app-upushy/upushy-project/upushy-project.module'
import { UpushySourceModule } from './app-upushy/upushy-source/upushy-source.module'
import { UpushyLogModule } from './app-upushy/upushy-log/upushy-log.module'
import { UpushyBasicModule } from './app-upushy/upushy-basic/upushy-basic.module'
// import { ApiSignMiddleware } from 'src/app-shared/middleware'

@Module({
  imports: [
    // 基础模块
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
    // 系统模块
    AppUserModule,
    // 业务模块
    UpushyProjectModule,
    UpushySourceModule,
    UpushyLogModule,
    UpushyBasicModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
  // controllers: [AppController],
})
export class AppModule {}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(ApiSignMiddleware).exclude({ path: `/${getEnv<string>('API_GLOBAL_PREFIX')}/basic/update`, method: RequestMethod.POST }).forRoutes('*')
//   }
// }
