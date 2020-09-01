import { Module } from '@nestjs/common';
import { UploadConfigService } from './upload.config.service';

@Module({
  providers: [
    {
      provide: UploadConfigService,
      useValue: new UploadConfigService(),
    },
  ],
  exports: [UploadConfigService],
})
export class UploadConfigModule {}
