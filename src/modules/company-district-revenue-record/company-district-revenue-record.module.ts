import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyDistrictRevenueRecordController } from './company-district-revenue-record.controller';
import { CompanyDistrictRevenueRecord } from './company-district-revenue-record.entity';
import { CompanyDistrictRevenueRecordService } from './company-district-revenue-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyDistrictRevenueRecord])],
  controllers: [CompanyDistrictRevenueRecordController],
  providers: [CompanyDistrictRevenueRecordService],
})
export class CompanyDistrictRevenueRecordModule {}
