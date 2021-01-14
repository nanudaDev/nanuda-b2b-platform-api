import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendeesOnline } from './attendees-online.entity';
import { NanudaAttendeesOnlineController } from './nanuda-user-attendees-online.controller';
import { NanudaAttendeesOnlineService } from './nanuda-user-attendees-online.service';

@Module({
  imports: [TypeOrmModule.forFeature([AttendeesOnline])],
  controllers: [NanudaAttendeesOnlineController],
  providers: [NanudaAttendeesOnlineService],
})
export class AttendeesOnlineModule {}
