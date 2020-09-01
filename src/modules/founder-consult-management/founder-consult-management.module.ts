import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FounderConsultManagement } from './founder-consult-management.entity';
import { FounderConsultManagementService } from './founder-consult-management.service';
import { FounderConsultManagementController } from './founder-consult-management.controller';
import { AdminFounderConsultManagementController } from './admin-founder-consult-management.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FounderConsultManagement])],
  controllers: [
    AdminFounderConsultManagementController,
    FounderConsultManagementController,
  ],
  providers: [FounderConsultManagementService],
})
export class FounderConsultManagementModule {}
