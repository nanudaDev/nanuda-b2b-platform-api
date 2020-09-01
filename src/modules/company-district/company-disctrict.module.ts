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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CompanyDistrict,
      CompanyDistrictUpdateHistory,
      CompanyDistrictAmenityMapper,
    ]),
    FileUploadModule,
  ],
  controllers: [AdminCompanyDistrictController, CompanyDistrictController],
  providers: [
    CompanyDistrictService,
    CompanyDistrictAnalysisService,
    CompanyDistrictAnalysisSenderService,
  ],
})
export class CompanyDistrictModule {}
