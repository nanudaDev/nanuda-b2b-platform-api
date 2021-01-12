import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySpaceNndBrandOpRecord } from './delivery-space-nnd-brand-op-record.entity';
import { DeliverySpaceNndBrandOpRecordService } from './delivery-space-nnd-brand-op-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySpaceNndBrandOpRecord])],
  providers: [DeliverySpaceNndBrandOpRecordService],
  exports: [DeliverySpaceNndBrandOpRecordService],
})
export class DeliverySpaceNndBrandOpRecordModule {}
