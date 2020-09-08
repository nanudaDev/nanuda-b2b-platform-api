import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductConsult } from './product-consult.entity';
import { ProductConsultService } from './product-consult.service';
import { AdminProductConsultController } from './admin-product-consult.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductConsult])],
  controllers: [AdminProductConsultController],
  providers: [ProductConsultService],
})
export class ProductConsultModule {}
