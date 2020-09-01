import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeBoard } from './notice-board.entity';
import { NoticeBoardService } from './notice-board.service';
import { AdminNoticeBoardController } from './admin-notice-board.controller';
import { NoticeBoardController } from './notice-board.controller';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeBoard]), FileUploadModule],
  controllers: [AdminNoticeBoardController, NoticeBoardController],
  providers: [NoticeBoardService],
})
export class NoticeBoardModule {}
