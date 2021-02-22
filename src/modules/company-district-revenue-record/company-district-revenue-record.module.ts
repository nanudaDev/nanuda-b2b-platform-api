import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCompanyDistrictRevenueRecordController } from './admin-company-district-revenue-record.controller';
import { CompanyDistrictRevenueRecordController } from './company-district-revenue-record.controller';
import { CompanyDistrictRevenueRecord } from './company-district-revenue-record.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { CompanyDistrictRevenueRecordService } from './company-district-revenue-record.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyDistrictRevenueRecord, CompanyDistrict]),
  ],
  controllers: [
    CompanyDistrictRevenueRecordController,
    AdminCompanyDistrictRevenueRecordController,
  ],
  providers: [CompanyDistrictRevenueRecordService],
})
export class CompanyDistrictRevenueRecordModule {}
