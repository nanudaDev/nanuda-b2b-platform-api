import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Space } from './space.entity';
import { SpaceType } from '../space-type/space-type.entity';
import { FounderConsult } from '../founder-consult/founder-consult.entity';
import { NanudaUser } from '../nanuda-user/nanuda-user.entity';
import { Admin } from '../admin';
import { AdminSpaceController } from './admin-space.controller';
import { SpaceService } from './space.service';
import { NanudaSpaceController } from './nanuda-space.controller';
import { NanudaSpaceService } from './nanuda-space.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Space,
      SpaceType,
      FounderConsult,
      NanudaUser,
      Admin,
    ]),
  ],
  controllers: [AdminSpaceController, NanudaSpaceController],
  providers: [SpaceService, NanudaSpaceService],
})
export class SpaceModule {}
