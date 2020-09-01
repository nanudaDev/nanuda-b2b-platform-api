import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySpaceOption } from './delivery-space-option.entity';
import { AdminDeliverySpaceOptionController } from './admin-delivery-space-option.controller';
import { DeliverySpaceOptionService } from './delivery-space-option.service';
import { DeliverySpaceOptionController } from './delivery-space-option.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySpaceOption])],
  controllers: [
    AdminDeliverySpaceOptionController,
    DeliverySpaceOptionController,
  ],
  providers: [DeliverySpaceOptionService],
})
export class DeliverySpaceOptionModule {}
