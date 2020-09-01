import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CodeManagement } from './code-management.entity';
import { CodeManagementService } from './code-management.service';
import { AdminCodeManagementController } from './admin-code-management.controller';
import { CodeManagementController } from './code-management.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CodeManagement])],
  controllers: [AdminCodeManagementController, CodeManagementController],
  providers: [CodeManagementService],
})
export class CodeManagementModule {}
