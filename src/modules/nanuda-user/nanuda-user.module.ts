import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NanudaUser } from './nanuda-user.entity';
import { NanudaUserService } from './nanuda-user.service';
import { AdminNanudaUserController } from './admin-nanuda-user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([NanudaUser])],
  controllers: [AdminNanudaUserController],
  providers: [NanudaUserService],
})
export class NanudaUserModule {}
