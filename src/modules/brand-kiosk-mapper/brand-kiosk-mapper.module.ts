import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentList } from '../payment-list/payment-list.entity';
import { AdminBrandKioskMapperController } from './admin-brand-kiosk-mapper.controller';
import { BrandKioskMapper } from './brand-kiosk-mapper.entity';
import { BrandKioskMapperService } from './brand-kiosk-mapper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrandKioskMapper]),
    TypeOrmModule.forFeature([PaymentList], 'kitchen'),
  ],
  controllers: [AdminBrandKioskMapperController],
  providers: [BrandKioskMapperService],
})
export class BrandKioskMapperModule {}
