import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { Company } from '../company/company.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { CompanyUser } from '../company-user/company-user.entity';
import { AdminSpaceController } from '../space/admin-space.controller';
import { CompanyService } from '../company/company.service';
import { CompanyUpdateHistory } from '../company-update-history/company-update-history.entity';
import { CompanyUserUpdateHistory } from '../company-user-update-history/company-user-update-history.entity';
import { SpaceService } from '../space/space.service';
import { Space } from '../space/space.entity';
import { AdminSearchController } from './admin-search.controller';
import { CompanyUserService } from '../company-user/company-user.service';
import { PasswordService } from '../auth';
import { NanudaSlackNotificationService } from 'src/core/utils';
import { FounderConsultService } from '../founder-consult/founder-consult.service';
import { CompanyDistrictUpdateHistory } from '../company-district-update-history/company-district-update-history.entity';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';
import { FileUploadModule } from '..';
import { DeliveryFounderConsultService } from '../delivery-founder-consult/delivery-founder-consult.service';
import { DeliveryFounderConsultModule } from '../delivery-founder-consult/delivery-founder-consult.module';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { DeliverySpaceService } from '../delivery-space/delivery-space.service';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { DeliverySpaceAmenityMapper } from '../delivery-space-amenity-mapper/delivery-space-amenity-mapper.entity';
import { DeliverySpaceDeliveryOptionMapper } from '../delivery-space-delivery-option-mapper/delivery-space-delivery-option-mapper.entity';
import { DeliveryFounderConsultContractHistory } from '../delivery-founder-consult-contract-history/delivery-founder-consult-contract-history.entity';
import { DeliverySpaceBrandMapper } from '../delivery-space-brand-mapper/delivery-space-brand-mapper.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NanudaUser,
      FounderConsult,
      Company,
      CompanyUpdateHistory,
      CompanyUser,
      CompanyUserUpdateHistory,
      CompanyDistrict,
      CompanyDistrictUpdateHistory,
      DeliveryFounderConsultContract,
      DeliveryFounderConsultContractHistory,
      DeliveryFounderConsult,
      DeliverySpace,
      DeliverySpaceBrandMapper,
      DeliverySpaceAmenityMapper,
      DeliverySpaceDeliveryOptionMapper,
      Space,
    ]),
    FileUploadModule,
  ],
  controllers: [AdminSearchController],
  providers: [
    CompanyService,
    CompanyUserService,
    FounderConsultService,
    DeliveryFounderConsultService,
    DeliverySpaceService,
    NanudaSlackNotificationService,
    PasswordService,
    SpaceService,
  ],
})
export class SearchModule {}
