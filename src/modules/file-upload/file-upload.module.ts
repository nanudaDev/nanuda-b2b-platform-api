import { Module } from '@nestjs/common';
import { UploadConfigModule } from 'src/config/upload.config.module';
import { FileUploadController } from './file-upload.controller';
import { FileUploadService } from './file-upload.service';

@Module({
  imports: [UploadConfigModule],
  controllers: [FileUploadController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}
