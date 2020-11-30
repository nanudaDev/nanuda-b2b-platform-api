import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCompanyDistrictPromotionController } from './admin-company-district-promotion.controller';
import { CompanyDistrictPromotion } from './company-district-promotion.entity';
import { CompanyDistrictPromotionService } from './company-district-promotion.service';
import { NanudaCompanyDistrictPromotionController } from './nanuda-company-district-promotion.controller';
import { NanudaCompanyDistrictPromotionService } from './nanuda-company-district-promotion.service';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyDistrictPromotion])],
  controllers: [
    AdminCompanyDistrictPromotionController,
    NanudaCompanyDistrictPromotionController,
  ],
  providers: [
    CompanyDistrictPromotionService,
    NanudaCompanyDistrictPromotionService,
  ],
})
export class CompanyDistrictPromotionModule {}
