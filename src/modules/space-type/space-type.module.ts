import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceType } from './space-type.entity';
import { SpaceTypeController } from './space-type.controller';
import { SpaceTypeService } from './space-type.service';
import { AdminSpaceTypeController } from './admin-space-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([SpaceType])],
  controllers: [AdminSpaceTypeController, SpaceTypeController],
  providers: [SpaceTypeService],
})
export class SpaceTypeModule {}
