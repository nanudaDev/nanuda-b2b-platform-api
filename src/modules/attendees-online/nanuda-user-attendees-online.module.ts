import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  B2CNanudaSlackNotificationService,
  NanudaSmsNotificationService,
} from 'src/core/utils';
import { AttendeesOnline } from './attendees-online.entity';
import { NanudaAttendeesOnlineController } from './nanuda-user-attendees-online.controller';
import { NanudaAttendeesOnlineService } from './nanuda-user-attendees-online.service';
import { SecondMeetingApplicant } from './second-meeting-applicant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AttendeesOnline, SecondMeetingApplicant]),
  ],
  controllers: [NanudaAttendeesOnlineController],
  providers: [
    NanudaAttendeesOnlineService,
    NanudaSmsNotificationService,
    B2CNanudaSlackNotificationService,
  ],
})
export class AttendeesOnlineModule {}
