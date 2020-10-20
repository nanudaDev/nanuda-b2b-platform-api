import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { AdminPopupController } from './admin-popup.controller';
import { Popup } from './popup.entity';
import { PopupService } from './popup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Popup]), FileUploadModule],
  controllers: [AdminPopupController],
  providers: [PopupService],
})
export class PopupModule {}
