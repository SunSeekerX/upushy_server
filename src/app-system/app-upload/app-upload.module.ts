import { Module } from '@nestjs/common';
import { AppUploadController } from './app-upload.controller';

@Module({
  controllers: [AppUploadController]
})
export class AppUploadModule {}
