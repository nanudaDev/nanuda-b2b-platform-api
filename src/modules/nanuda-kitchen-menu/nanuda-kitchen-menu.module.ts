import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NanudaKitchenMenu } from './nanuda-kitchen-menu.entity';
import { NanudaKitchenMenuService } from './nanuda-kitchen-menu.service';
import { AdminNanudaKitchenMenuController } from './admin-nanuda-kitchen-menu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NanudaKitchenMenu], 'kitchen')],
  controllers: [AdminNanudaKitchenMenuController],
  providers: [NanudaKitchenMenuService],
})
export class NanudaKitchenMenuModule {}
