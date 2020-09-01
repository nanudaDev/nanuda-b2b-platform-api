import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './company.entity';
import { CompanyUser } from '../company-user/company-user.entity';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { CompanyUpdateHistory } from '../company-update-history/company-update-history.entity';
import { AdminCompanyController } from './admin-company.controller';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { CompanyDistrictUpdateHistory } from '../company-district-update-history/company-district-update-history.entity';
import { CompanyDistrictService } from '../company-district/company-district.service';
import { CompanyUserUpdateHistory } from '../company-user-update-history/company-user-update-history.entity';
import { CompanyDistrictAmenityMapper } from '../company-district-amenity-mapper/company-district-amenity-mapper.entity';
import { CompanyDistrictAnalysisSenderService } from '../company-district/company-district-analysis-sender.service';
import { CompanyDistrictAnalysisService } from '../company-district/company-district-analysis.service';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Company,
      CompanyUser,
      CompanyUpdateHistory,
      CompanyDistrict,
      CompanyDistrictAmenityMapper,
      CompanyDistrictUpdateHistory,
      CompanyUser,
      CompanyUserUpdateHistory,
    ]),
    FileUploadModule,
  ],
  controllers: [AdminCompanyController, CompanyController],
  providers: [
    CompanyService,
    CompanyDistrictService,
    CompanyDistrictAnalysisService,
    CompanyDistrictAnalysisSenderService,
  ],
})
export class CompanyModule {}
