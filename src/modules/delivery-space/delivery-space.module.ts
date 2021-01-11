import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySpace } from './delivery-space.entity';
import { DeliverySpaceAmenityMapper } from '../delivery-space-amenity-mapper/delivery-space-amenity-mapper.entity';
import { DeliverySpaceService } from './delivery-space.service';
import { AdminDeliverySpaceController } from './admin-delivery-space.controller';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { DeliverySpaceOption } from '../delivery-space-option/delivery-space-option.entity';
import { Amenity } from '../amenity/amenity.entity';
import { DeliverySpaceDeliveryOptionMapper } from '../delivery-space-delivery-option-mapper/delivery-space-delivery-option-mapper.entity';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { DeliveryFounderConsultContractHistory } from '../delivery-founder-consult-contract-history/delivery-founder-consult-contract-history.entity';
import { DeliverySpaceController } from './delivery-space.controller';
import { NanudaSlackNotificationService } from 'src/core/utils';
import { DeliverySpaceBrandMapper } from '../delivery-space-brand-mapper/delivery-space-brand-mapper.entity';
import { NanudaDeliverySpaceController } from './nanuda-delivery-space.controller';
import { NanudaDeliverySpaceService } from './nanuda-delivery-space.service';
import { FavoriteSpaceMapper } from '../favorite-space-mapper/favorite-space-mapper.entity';
import { DeliverySpaceNndRecordModule } from '../delivery-space-nnd-op-record/delivery-space-nnd-op-record.module';
import { DeliverySpaceNndBrandOpRecordModule } from '../delivery-space-nnd-brand-op-record/delivery-space-nnd-brand-op-record.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Amenity,
      CompanyDistrict,
      DeliverySpace,
      DeliverySpaceOption,
      DeliverySpaceBrandMapper,
      DeliverySpaceDeliveryOptionMapper,
      DeliverySpaceAmenityMapper,
      DeliveryFounderConsultContract,
      DeliveryFounderConsultContractHistory,
      FavoriteSpaceMapper,
    ]),
    FileUploadModule,
    DeliverySpaceNndRecordModule,
    DeliverySpaceNndBrandOpRecordModule
  ],
  controllers: [
    AdminDeliverySpaceController,
    DeliverySpaceController,
    NanudaDeliverySpaceController,
  ],
  providers: [
    DeliverySpaceService,
    NanudaSlackNotificationService,
    NanudaDeliverySpaceService,
  ],
})
export class DeliverySpaceModule {}
