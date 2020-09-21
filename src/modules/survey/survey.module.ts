import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Survey } from './survey.entity';
import { NanudaSurveyService } from './nanuda-survey.service';
import { NanudaSurveyController } from './nanuda-survey.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Survey])],
  controllers: [NanudaSurveyController],
  providers: [NanudaSurveyService],
})
export class SurveyModule {}
