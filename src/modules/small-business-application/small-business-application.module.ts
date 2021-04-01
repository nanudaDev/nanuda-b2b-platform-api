import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmallBusinessApplicationController } from './small-business-application.controller';
import { SmallBusinessApplication } from './small-business-application.entity';
import { SmallBusinessApplicationService } from './small-business-application.service';

@Module({
  imports: [TypeOrmModule.forFeature([SmallBusinessApplication])],
  controllers: [SmallBusinessApplicationController],
  providers: [SmallBusinessApplicationService],
  exports: [],
})
export class SmallBusinessApplicationModule {}
