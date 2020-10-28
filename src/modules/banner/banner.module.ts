import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from './banner.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { BannerService } from './banner.service';
import { AdminBannerController } from './admin-banner.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Banner]), FileUploadModule],
  controllers: [AdminBannerController],
  providers: [BannerService],
})
export class BannerModule {}
