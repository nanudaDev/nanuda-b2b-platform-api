import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { AdminPopupController } from './admin-popup.controller';
import { NanudaPopupController } from './nanuda-popup-controller';
import { NanudaPopupService } from './nanuda-popup.service';
import { Popup } from './popup.entity';
import { PopupService } from './popup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Popup]), FileUploadModule],
  controllers: [AdminPopupController, NanudaPopupController],
  providers: [PopupService, NanudaPopupService],
})
export class PopupModule {}
