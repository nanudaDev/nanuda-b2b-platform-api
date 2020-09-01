import { Module } from '@nestjs/common';
import { Type } from 'class-transformer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodCategory } from './food-category.entity';
import { FoodCategoryService } from './food-category.service';
import { AdminFoodCategoryController } from './admin-food-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FoodCategory])],
  controllers: [AdminFoodCategoryController],
  providers: [FoodCategoryService],
})
export class FoodCategoryModule {}
