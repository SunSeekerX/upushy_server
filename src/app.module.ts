import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
import { join } from 'path'

import { getEnv } from 'src/app-shared/config'
import { LogInterceptor } from 'src/app-shared/interceptor'
import { AppController } from './app.controller'

import { UserPermissionEntity } from 'src/app-system/app-auth/entities'
import { UserEntity } from 'src/app-system/app-user/entities'
import { AppConfigEntity } from 'src/app-system/app-config/entities'
import { DeviceInfoLogEntity, LoginLogEntity, UpdateLogEntity } from 'src/app-upushy/upushy-log/entities'
import { ProjectEntity } from 'src/app-upushy/upushy-project/entities'
import { SourceEntity } from 'src/app-upushy/upushy-source/entities'

/**
 * 系统模块
 */
import { AppCacheModule } from 'src/app-system/app-cache/app-cache.module'
import { AppUserModule } from './app-system/app-user/app-user.module'
import { UpushyProjectModule } from './app-upushy/upushy-project/upushy-project.module'
import { UpushySourceModule } from './app-upushy/upushy-source/upushy-source.module'
import { UpushyLogModule } from './app-upushy/upushy-log/upushy-log.module'
import { UpushyBasicModule } from './app-upushy/upushy-basic/upushy-basic.module'
// import { ApiSignMiddleware } from 'src/app-shared/middleware'
import { AppAuthModule } from './app-system/app-auth/app-auth.module'
import { AppConfigController } from './app-system/app-config/app-config.controller'
import { AppConfigModule } from './app-system/app-config/app-config.module'
import { AppStatsModule } from './app-system/app-stats/app-stats.module'
import { AppUploadModule } from './app-system/app-upload/app-upload.module'
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
      // entities: ['dist/**/*.entity.js'],
      entities: [
        UserEntity,
        AppConfigEntity,
        UserPermissionEntity,
        DeviceInfoLogEntity,
        LoginLogEntity,
        UpdateLogEntity,
        ProjectEntity,
        SourceEntity,
      ],
      synchronize: getEnv('DB_TABLE_SYNC'),
      logging: true,
      extra: {
        // 不配置这个 emoji 无法保存
        charset: 'utf8mb4_general_ci',
      },
    }),
    // 系统模块
    AppUserModule,
    // 系统认证模块
    AppAuthModule,
    // 系统配置模块
    AppConfigModule,
    // 系统统计数据
    AppStatsModule,
    // 系统文件上传
    AppUploadModule,
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
  controllers: [AppController, AppConfigController],
})
export class AppModule {
  constructor() {}
}
// export class AppModule implements NestModule {
//   configure(consumer: MiddlewareConsumer): void {
//     consumer.apply(ApiSignMiddleware).exclude({ path: `/${getEnv<string>('API_GLOBAL_PREFIX')}/basic/update`, method: RequestMethod.POST }).forRoutes('*')
//   }
// }
