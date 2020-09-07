import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService, CacheConfigService } from './config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor, HttpCacheInterceptor } from './core';
import {
  AuthModule,
  AmenityModule,
  CompanyUserModule,
  CodeManagementModule,
  FounderConsultModule,
  CompanyModule,
  DashboardModule,
  SpaceTypeModule,
  FoodCategoryModule,
  CompanyDistrictModule,
  SpaceModule,
  SearchModule,
  SmsAuthModule,
  NoticeBoardModule,
  FounderConsultManagementModule,
  InquiryModule,
  DeliverySpaceModule,
  DeliveryFounderConsultModule,
  DeliveryFounderConsultContractModule,
  FileUploadModule,
  DeliverySpaceOptionModule,
  NanudaUserModule,
  BrandModule,
  PaymentListModule,
  ProductConsultModule,
} from './modules';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentList } from './modules/payment-list/payment-list.entity';
require('dotenv').config();
const env = process.env;
@Module({
  imports: [
    // CacheModule.registerAsync({ useClass: CacheConfigService }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forRoot({
      name: 'analysis',
      type: 'mysql' as 'mysql',
      host: env.BIZ_DB_HOST,
      port: Number(env.BIZ_DB_PORT),
      username: env.BIZ_DB_USERNAME,
      password: env.BIZ_DB_PASSWORD,
      database: env.BIZ_DB_DATABASE,
      // won't need to keep alive
      //   keepConnectionAlive: true,
      bigNumberStrings: false,
      supportBigNumbers: false,
      entities: [],
      synchronize: false,
    }),
    TypeOrmModule.forRoot({
      name: 'kitchen',
      type: 'mariadb' as 'mariadb',
      host: env.REV_DB_HOST,
      port: Number(env.REV_DB_PORT),
      username: env.REV_DB_USERNAME,
      password: env.REV_DB_PASSWORD,
      database: env.REV_DB_NAME,
      // won't need to keep alive
      //   keepConnectionAlive: true,
      bigNumberStrings: false,
      supportBigNumbers: false,
      entities: [PaymentList],
      // migrations: [],
      // cli: {},
      // subscribers: [],
      //   Do not turn to true!!!! 나누다 키친 데이터 다 날라가요 ~ ㅠㅠ
      synchronize: false,
    }),
    AuthModule,
    AdminModule,
    AmenityModule,
    BrandModule,
    CodeManagementModule,
    CompanyModule,
    CompanyDistrictModule,
    CompanyUserModule,
    DashboardModule,
    DeliveryFounderConsultModule,
    DeliveryFounderConsultContractModule,
    DeliverySpaceModule,
    DeliverySpaceOptionModule,
    FileUploadModule,
    FoodCategoryModule,
    FounderConsultModule,
    FounderConsultManagementModule,
    InquiryModule,
    NanudaUserModule,
    NoticeBoardModule,
    PaymentListModule,
    ProductConsultModule,
    SpaceModule,
    SearchModule,
    SmsAuthModule,
    SpaceTypeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    // { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
  ],
})
export class AppModule {}
