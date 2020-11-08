import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAttendeesController } from './admin-attendees.controller';
import { Attendees } from './attendees.entity';
import { AttendeesService } from './attendees.service';

@Module({
  imports: [TypeOrmModule.forFeature([Attendees])],
  controllers: [AdminAttendeesController],
  providers: [AttendeesService],
})
export class AttendeesModule {}
