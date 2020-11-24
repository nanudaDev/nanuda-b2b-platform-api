import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { AdminMessageDeliverySpaceController } from './admin-message-delivery-space.controller';
import { MessageDeliverySpaceService } from './admin-message-delivery-space.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliverySpace])],
  controllers: [AdminMessageDeliverySpaceController],
  providers: [MessageDeliverySpaceService],
})
export class MessageDeliverySpaceModule {}
