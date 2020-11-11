import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmsAuthModule } from '../sms-auth/sms-auth.module';
import { AdminAttendeesController } from './admin-attendees.controller';
import { Attendees } from './attendees.entity';
import { AttendeesService } from './attendees.service';
import { NanudaAttendeesController } from './nanuda-attendees.controller';
import { NanudaAttendeesService } from './nanuda-attendees.service';
import { B2CNanudaSlackNotificationService } from 'src/core/utils';

@Module({
  imports: [TypeOrmModule.forFeature([Attendees]), SmsAuthModule],
  controllers: [AdminAttendeesController, NanudaAttendeesController],
  providers: [
    AttendeesService,
    NanudaAttendeesService,
    B2CNanudaSlackNotificationService,
  ],
})
export class AttendeesModule {}
