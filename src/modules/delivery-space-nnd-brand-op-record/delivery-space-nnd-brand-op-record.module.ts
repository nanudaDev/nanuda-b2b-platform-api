import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminDeliverySpaceNndBrandOpController } from './admin-delivery-space-nnd-brand-op-record.controller';
import { DeliverySpaceNndBrandOpRecord } from './delivery-space-nnd-brand-op-record.entity';
import { DeliverySpaceNndBrandOpRecordService } from './delivery-space-nnd-brand-op-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySpaceNndBrandOpRecord])],
  controllers: [AdminDeliverySpaceNndBrandOpController],
  providers: [DeliverySpaceNndBrandOpRecordService],
  exports: [DeliverySpaceNndBrandOpRecordService],
})
export class DeliverySpaceNndBrandOpRecordModule {}
