/**
 * @name:
 * @author: SunSeekerX
 * @Date: 2020-06-22 11:08:40
 * @LastEditors: SunSeekerX
 * @LastEditTime: 2020-11-02 15:32:51
 */

import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { TypeOrmModule } from '@nestjs/typeorm'
// import { AlicloudOssModule } from 'nestjs-alicloud-oss'
import { RedisModule } from 'nestjs-redis'
// import { ScheduleModule } from '@nestjs/schedule';

import { UserModule } from './user/user.module'
import { ProjectModule } from './project/project.module'
import { SourceModule } from './source/source.module'
import { LogInterceptor } from 'src/shared/interceptor/log.interceptor'
import { SignMiddleware } from 'src/shared/middleware/sign.middleware'

import { AppController } from './app.controller'
// import { TasksModule } from './tasks/tasks.module';
import { BasicModule } from './basic/basic.module'

@Module({
  imports: [
    RedisModule.register({
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      db: parseInt(process.env.REDIS_DB),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_PRIFIX,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      logging: false,
      extra: {
        charset: 'utf8mb4_general_ci',
      },
    }),
    // AlicloudOssModule.withConfig({
    //   options: {
    //     accessKeyId: process.env.OSS_ACCESSKEYID,
    //     accessKeySecret: process.env.OSS_ACCESSKEYSECRET,
    //     // the bucket data region location, doc demo used 'oss-cn-beijing'.
    //     region: process.env.OSS_REGION,
    //     // the default bucket you want to access, doc demo used 'nest-alicloud-oss-demo'.
    //     bucket: process.env.OSS_BUCKET,
    //   },
    // }),
    UserModule,
    ProjectModule,
    SourceModule,
    BasicModule,
    // TasksModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LogInterceptor,
    },
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(SignMiddleware)
      .exclude(
        { path: '/api/update', method: RequestMethod.GET },
        { path: '/api/systemConfig', method: RequestMethod.GET },
      )
      .forRoutes(AppController)
  }
}
