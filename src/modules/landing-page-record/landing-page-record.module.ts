import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandingPageRecord } from './landing-page-record.entity';
import { NanudaLandingPageRecordController } from './nanuda-landing-page-record.controller';
import { NanudaLandingPageRecordService } from './nanuda-landing-page-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([LandingPageRecord])],
  controllers: [NanudaLandingPageRecordController],
  providers: [NanudaLandingPageRecordService],
})
export class LandingPageRecordModule {}
