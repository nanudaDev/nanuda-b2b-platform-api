import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { AdminDashboardController } from './admin-dashboard.controller';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { DeliveryFounderConsultModule } from '../delivery-founder-consult/delivery-founder-consult.module';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FounderConsult, DeliveryFounderConsult])],
  controllers: [AdminDashboardController, DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
