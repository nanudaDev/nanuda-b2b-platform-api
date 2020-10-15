import { Module } from '@nestjs/common';
import { NanudaHomepageController } from './nanuda-homepage.controller';
import { NanudaHomepageService } from './nanuda-homepage.service';

@Module({
    imports: [],
    controllers: [NanudaHomepageController],
    providers: [NanudaHomepageService]
})

export class NanudaHomepageModule {}