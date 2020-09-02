import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './banner.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Banner]), FileUploadModule],
  controllers: [],
  providers: [],
})
export class BannerModule {}
