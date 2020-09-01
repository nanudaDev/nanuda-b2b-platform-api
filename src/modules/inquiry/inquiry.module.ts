import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './inquiry.entity';
import { InquiryService } from './inquiry.service';
import { InquiryController } from './inquiry.controller';
import { AdminInquiryController } from './admin-inquiry.controller';
import { NanudaSlackNotificationService } from 'src/core/utils';

@Module({
  imports: [TypeOrmModule.forFeature([Inquiry])],
  controllers: [AdminInquiryController, InquiryController],
  providers: [InquiryService, NanudaSlackNotificationService],
})
export class InquiryModule {}
