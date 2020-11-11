import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUploadModule } from '..';
import { AdminPresentationEventController } from './admin-presentation-event.controller';
import { NanudaPresentationEventController } from './nanuda-presentation-event.controller';
import { NanudaPresentationEventService } from './nanuda-presentation-event.service';
import { PresentationEvent } from './presentation-event.entity';
import { PresentationEventService } from './presentation-event.service';

@Module({
  imports: [TypeOrmModule.forFeature([PresentationEvent]), FileUploadModule],
  controllers: [
    AdminPresentationEventController,
    NanudaPresentationEventController,
  ],
  providers: [PresentationEventService, NanudaPresentationEventService],
})
export class PresentationEventModule {}
