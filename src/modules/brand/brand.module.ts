import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { FoodCategory } from '../food-category/food-category.entity';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { BrandService } from './brand.service';
import { AdminBrandController } from './admin-brand.controller';
import { Admin } from '../admin';
import { DeliverySpaceBrandMapper } from '../delivery-space-brand-mapper/delivery-space-brand-mapper.entity';
import { SpaceNanudaBrand } from '../space-nanuda-brand/space-nanuda-brand.entity';
import { SpaceTypeBrandMapper } from '../space-type-brand-mapper/space-type-brand-mapper.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Admin,
      Brand,
      FoodCategory,
      DeliverySpaceBrandMapper,
      SpaceNanudaBrand,
      SpaceTypeBrandMapper,
    ]),
    FileUploadModule,
  ],
  controllers: [AdminBrandController],
  providers: [BrandService],
})
export class BrandModule {}
