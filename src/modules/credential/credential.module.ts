import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminCredentialController } from './admin-credential.controller';
import { Credential } from './credential.entity';
import { CredentialService } from './credential.service';

@Module({
  imports: [TypeOrmModule.forFeature([Credential])],
  controllers: [AdminCredentialController],
  providers: [CredentialService],
})
export class CredentialModule {}
