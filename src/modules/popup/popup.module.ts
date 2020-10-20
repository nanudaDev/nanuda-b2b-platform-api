import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminPopupController } from './admin-popup.controller';
import { Popup } from './popup.entity';
import { PopupService } from './popup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Popup])],
  controllers: [AdminPopupController],
  providers: [PopupService],
})
export class PopupModule {}
