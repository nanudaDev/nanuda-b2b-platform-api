import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryFounderConsultContract } from './delivery-founder-consult-contract.entity';
import { DeliveryFounderConsultContractService } from './delivery-founder-consult-contract.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { AdminDeliveryFounderConsultContractController } from './admin-delivery-founder-consult-contract.controller';
import { DeliveryFounderConsultContractController } from './delivery-founder-consult-contract.controller';
import { DeliveryFounderConsultContractHistory } from '../delivery-founder-consult-contract-history/delivery-founder-consult-contract-history.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DeliveryFounderConsultContract,
      DeliveryFounderConsultContractHistory,
    ]),
    FileUploadModule,
  ],
  controllers: [
    AdminDeliveryFounderConsultContractController,
    DeliveryFounderConsultContractController,
  ],
  providers: [DeliveryFounderConsultContractService],
})
export class DeliveryFounderConsultContractModule {}
