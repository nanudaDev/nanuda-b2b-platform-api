import { Module, CacheModule, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
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
  FavoriteSpaceMapperModule,
  NanudaKitchenMenuModule,
  MenuModule,
  ArticleModule,
  BestSpaceMapperModule,
  BrandKioskMapperModule,
  CredentialModule,
  NanudaHomepageModule,
  PopupModule,
  BannerModule,
  PresentationEventModule,
  AttendeesModule,
  MessageDeliverySpaceModule,
  CompanyDistrictPromotionModule,
  DeliveryFounderConsultRecordModule,
  LandingPageRecordModule,
  LandingPageSuccessRecordModule,
  DeliveryFounderConsultReplyModule,
  DeliverySpaceNndBrandOpRecordModule,
  AttendeesOnlineModule,
  SmallBusinessApplicationModule,
} from './modules';
import { AdminModule } from './modules/admin/admin.module';
import { PaymentList } from './modules/payment-list/payment-list.entity';
import { NanudaKitchenMaster } from './modules/nanuda-kitchen-master/nanuda-kitchen-master.entity';
import { NanudaKitchenMenu } from './modules/nanuda-kitchen-menu/nanuda-kitchen-menu.entity';
import { KioskOrderList } from './modules/kiosk-order-list/kiosk-order-list.entity';
import { IndexMessage } from './modules/message-delivery-space/index-message.entity';
import { DeliverySpaceNndRecordModule } from './modules/delivery-space-nnd-op-record/delivery-space-nnd-op-record.module';
import { CompanyDistrictRevenueRecordModule } from './modules/company-district-revenue-record/company-district-revenue-record.module';
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
      entities: [
        NanudaKitchenMaster,
        NanudaKitchenMenu,
        PaymentList,
        KioskOrderList,
      ],
      // migrations: [],
      // cli: {},
      // subscribers: [],
      //   Do not turn to true!!!! 나누다 키친 데이터 다 날라가요 ~ ㅠㅠ
      synchronize: false,
    }),
    // 상권분석 관련 디비
    TypeOrmModule.forRoot({
      name: 'wq',
      type: 'mysql' as 'mysql',
      host: env.ANALYSIS_DB_HOST,
      port: Number(env.ANALYSIS_DB_PORT),
      username: env.ANALYSIS_DB_USERNAME,
      password: env.ANALYSIS_DB_PASSWORD,
      database: env.ANALYSIS_DB_DATABASE,
      // won't need to keep alive
      //   keepConnectionAlive: true,
      bigNumberStrings: false,
      supportBigNumbers: false,
      entities: [IndexMessage],
      // migrations: [],
      // cli: {},
      // subscribers: [],
      //   Do not turn to true!!!! 나누다 키친 데이터 다 날라가요 ~ ㅠㅠ
      synchronize: false,
    }),
    AuthModule,
    AdminModule,
    AmenityModule,
    ArticleModule,
    AttendeesModule,
    AttendeesOnlineModule,
    BannerModule,
    BestSpaceMapperModule,
    BrandModule,
    BrandKioskMapperModule,
    CodeManagementModule,
    CompanyModule,
    CompanyDistrictModule,
    CompanyDistrictPromotionModule,
    CompanyDistrictRevenueRecordModule,
    CompanyUserModule,
    CredentialModule,
    DashboardModule,
    DeliveryFounderConsultModule,
    DeliveryFounderConsultContractModule,
    DeliveryFounderConsultRecordModule,
    DeliveryFounderConsultReplyModule,
    DeliverySpaceModule,
    DeliverySpaceOptionModule,
    DeliverySpaceNndRecordModule,
    DeliverySpaceNndBrandOpRecordModule,
    FavoriteSpaceMapperModule,
    FileUploadModule,
    FoodCategoryModule,
    FounderConsultModule,
    FounderConsultManagementModule,
    InquiryModule,
    LandingPageRecordModule,
    LandingPageSuccessRecordModule,
    MenuModule,
    MessageDeliverySpaceModule,
    NanudaHomepageModule,
    NanudaUserModule,
    NanudaKitchenMenuModule,
    NoticeBoardModule,
    PaymentListModule,
    PopupModule,
    PresentationEventModule,
    ProductConsultModule,
    SpaceModule,
    // SearchModule,
    SmsAuthModule,
    SpaceTypeModule,
    SmallBusinessApplicationModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    // { provide: APP_INTERCEPTOR, useClass: HttpCacheInterceptor },
  ],
})
export class AppModule {}
