import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BestSpaceMapper } from './best-space.entity';
import { BestSpaceService } from './best-space.service';
import { NanudaBestSpaceService } from './nanuda-best-space.service';
import { NanudaBestSpaceController } from './nanuda-best-space.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BestSpaceMapper])],
  controllers: [NanudaBestSpaceController],
  providers: [BestSpaceService, NanudaBestSpaceService],
})
export class BestSpaceMapperModule {}
