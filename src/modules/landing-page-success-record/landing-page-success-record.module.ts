import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  B2CNanudaSlackNotificationService,
  NanudaSlackNotificationService,
  NanudaSmsNotificationService,
} from 'src/core/utils';
import { LandingPageSuccessRecord } from './landing-page-success-record.entity';
import { NanudaLandingPageSuccessRecordController } from './nanuda-landing-page-success-record.controller';
import { NanudaLandingPageSuccessRecordService } from './nanuda-landing-page-success-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([LandingPageSuccessRecord])],
  controllers: [NanudaLandingPageSuccessRecordController],
  providers: [
    NanudaLandingPageSuccessRecordService,
    B2CNanudaSlackNotificationService,
    NanudaSmsNotificationService,
  ],
})
export class LandingPageSuccessRecordModule {}
