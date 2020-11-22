import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryFounderConsult } from './delivery-founder-consult.entity';
import { AdminDeliveryFounderConsultController } from './admin-delivery-founder-consult.controller';
import { DeliveryFounderConsultService } from './delivery-founder-consult.service';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { CompanyUser } from '../company-user/company-user.entity';
import { Company } from '../company/company.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import {
  NanudaSlackNotificationService,
  NanudaSmsNotificationService,
} from 'src/core/utils';
import { DeliveryFounderConsultController } from './delivery-founder-consult.controller';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { DeliverySpaceService } from '../delivery-space/delivery-space.service';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';
import { DeliverySpaceAmenityMapper } from '../delivery-space-amenity-mapper/delivery-space-amenity-mapper.entity';
import { DeliverySpaceDeliveryOptionMapper } from '../delivery-space-delivery-option-mapper/delivery-space-delivery-option-mapper.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { DeliveryFounderConsultContractHistory } from '../delivery-founder-consult-contract-history/delivery-founder-consult-contract-history.entity';
import { DeliverySpaceBrandMapper } from '../delivery-space-brand-mapper/delivery-space-brand-mapper.entity';
import { NanudaDeliveryFounderConsultService } from './nanuda-delivery-founder-consult.service';
import { NanudaDeliveryFounderConsultController } from './nanuda-delivery-founder-consult.controller';
import { B2CNanudaSlackNotificationService } from 'src/core/utils/b2c-nanuda-slack-notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryFounderConsult,
      DeliverySpace,
      DeliverySpaceBrandMapper,
      DeliveryFounderConsultContract,
      DeliverySpaceAmenityMapper,
      DeliverySpaceDeliveryOptionMapper,
      DeliveryFounderConsultContract,
      DeliveryFounderConsultContractHistory,
      NanudaUser,
      CompanyUser,
      Company,
      CompanyDistrict,
    ]),
    FileUploadModule,
  ],
  controllers: [
    AdminDeliveryFounderConsultController,
    DeliveryFounderConsultController,
    NanudaDeliveryFounderConsultController,
  ],
  providers: [
    DeliveryFounderConsultService,
    NanudaSlackNotificationService,
    B2CNanudaSlackNotificationService,
    DeliverySpaceService,
    NanudaDeliveryFounderConsultService,
    NanudaSmsNotificationService,
  ],
})
export class DeliveryFounderConsultModule {}
