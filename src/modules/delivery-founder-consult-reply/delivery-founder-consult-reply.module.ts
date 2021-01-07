import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsNotificationService } from 'src/core/utils';
import { AdminDeliveryFounderConsultReplyController } from './admin-delivery-founder-consult-reply.controller';
import { DeliveryFounderConsultReplyController } from './delivery-founder-consult-reply.controller';
import { DeliveryFounderConsultReply } from './delivery-founder-consult-reply.entity';
import { DeliveryFounderConsultReplyService } from './delivery-founder-consult-reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([DeliveryFounderConsultReply])],
  controllers: [
    AdminDeliveryFounderConsultReplyController,
    DeliveryFounderConsultReplyController,
  ],
  providers: [DeliveryFounderConsultReplyService, SmsNotificationService],
})
export class DeliveryFounderConsultReplyModule {}
