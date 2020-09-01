import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyPricing } from './company-pricing.entity';
import { CompanyPricingService } from './company-pricing.service';
import { CompanyPricingMapper } from '../company-pricing-mapper/company-pricing-mapper.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyPricing, CompanyPricingMapper])],
  controllers: [],
  providers: [CompanyPricingService],
})
export class CompanyPricingModule {}
