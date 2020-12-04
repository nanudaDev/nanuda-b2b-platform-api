import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyDistrict } from './company-district.entity';
import { CompanyDistrictService } from './company-district.service';
import { CompanyDistrictController } from './company-district.controller';
import { AdminCompanyDistrictController } from './admin-company-district.controller';
import { CompanyDistrictUpdateHistory } from '../company-district-update-history/company-district-update-history.entity';
import { CompanyDistrictAmenityMapper } from '../company-district-amenity-mapper/company-district-amenity-mapper.entity';
import { CompanyDistrictAnalysisService } from './company-district-analysis.service';
import { CompanyDistrictAnalysisSenderService } from './company-district-analysis-sender.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { NanudaCompanyDistrictController } from './nanuda-company-district.controller';
import { NanudaCompanyDistrictService } from './nanuda-company-district.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyDistrict,
      CompanyDistrictUpdateHistory,
      CompanyDistrictAmenityMapper,
    ]),
    FileUploadModule,
  ],
  controllers: [
    AdminCompanyDistrictController,
    CompanyDistrictController,
    NanudaCompanyDistrictController,
  ],
  providers: [
    CompanyDistrictService,
    CompanyDistrictAnalysisService,
    CompanyDistrictAnalysisSenderService,
    NanudaCompanyDistrictService,
  ],
})
export class CompanyDistrictModule {}
