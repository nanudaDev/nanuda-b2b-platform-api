import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySpaceNndOpRecord } from './delivery-space-nnd-op-record.entity';
import { DeliverySpaceNndOpRecordService } from './delivery-space-nnd-op-record.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySpaceNndOpRecord])],
  providers: [DeliverySpaceNndOpRecordService],
  exports: [DeliverySpaceNndOpRecordService],
})
export class DeliverySpaceNndRecordModule {}
