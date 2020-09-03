import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentList } from './payment-list.entity';
import { AdminPaymentListController } from './admin-payment-list.controller';
import { PaymentListService } from './payment-list.service';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentList], 'kitchen')],
  controllers: [AdminPaymentListController],
  providers: [PaymentListService],
})
export class PaymentListModule {}
