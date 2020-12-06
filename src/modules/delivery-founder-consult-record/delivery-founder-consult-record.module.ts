import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { AdminDeliveryFounderConsultRecordController } from './admin-delivery-founder-consult-record.controller';
import { DeliveryFounderConsultRecord } from './delivery-founder-consult-record.entity';
import { DeliveryFounderConsultRecordService } from './delivery-founder-consult-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryFounderConsultRecord])],
  controllers: [AdminDeliveryFounderConsultRecordController],
  providers: [DeliveryFounderConsultRecordService],
})
export class DeliveryFounderConsultRecordModule {}
