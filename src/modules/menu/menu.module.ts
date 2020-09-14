import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Menu } from './menu.entity';
import { MenuService } from './menu.service';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { AdminMenuController } from './admin-menu.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Menu]), FileUploadModule],
  controllers: [AdminMenuController],
  providers: [MenuService],
})
export class MenuModule {}
