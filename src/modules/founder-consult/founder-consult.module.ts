import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FounderConsult } from './founder-consult.entity';
import { Admin } from '../admin';
import { FounderConsultService } from './founder-consult.service';
import { AdminFounderConsultController } from './admin-founder-consult.controller';
import { FounderConsultController } from './founder-consult.controller';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { NanudaSlackNotificationService } from 'src/core/utils';
import { DeliveryFounderConsultContract } from '../delivery-founder-consult-contract/delivery-founder-consult-contract.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      DeliveryFounderConsultContract,
      FounderConsult,
      NanudaUser,
    ]),
  ],
  controllers: [AdminFounderConsultController, FounderConsultController],
  providers: [FounderConsultService, NanudaSlackNotificationService],
})
export class FounderConsultModule {}
