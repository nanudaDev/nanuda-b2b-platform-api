require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { AligoAuth, MessageObject } from './sms-notification.service';
import * as aligoapi from 'aligoapi';
import { Request } from 'express';
import { Attendees } from 'src/modules/attendees/attendees.entity';
import * as moment from 'moment';
import { DeliveryFounderConsult } from 'src/modules/delivery-founder-consult/delivery-founder-consult.entity';
import { Admin } from 'src/modules/admin';
import { ENVIRONMENT } from 'src/config';
import { BestSpaceMapper } from 'src/modules/best-space/best-space.entity';
import { LandingPageSuccessRecord } from 'src/modules/landing-page-success-record/landing-page-success-record.entity';
import { AttendeesOnline } from 'src/modules/attendees-online/attendees-online.entity';
import { SecondMeetingApplicant } from 'src/modules/attendees-online/second-meeting-applicant.entity';
import { NanudaUser } from 'src/modules/nanuda-user/nanuda-user.entity';

@Injectable()
export class NanudaSmsNotificationService {
  /**
   * send message
   * @param attendees
   * @param req
   */
  async sendPresentationEvent(attendees: Attendees, req?: Request) {
    const payload = await this.__presentation_event_notification(attendees);
    req.body = payload.body;
    console.log(payload);
    const sms = await aligoapi.send(req, payload.auth);
    if (process.env.NODE_ENV === ENVIRONMENT.PRODUCTION) {
      console.log(sms);
    }
    return;
  }

  /**
   * send message
   * @param attendees
   * @param req
   */
  async sendPresentationEventOnline(attendees: AttendeesOnline, req?: Request) {
    const payload = await this.__presentation_event_notification_online(
      attendees,
    );
    req.body = payload.body;
    console.log(payload);
    const sms = await aligoapi.send(req, payload.auth);
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      // console.log(sms);
    }
    return;
  }

  async sendDeliveryFounderConsultMessage(
    deliveryFounderConsult: DeliveryFounderConsult,
    req?: Request,
  ) {
    const payload = await this.__send_dist_complete_notification(
      deliveryFounderConsult,
    );
    req.body = payload.body;
    const sms = await aligoapi.send(req, payload.auth);
    if (
      process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT ||
      ENVIRONMENT.STAGING
    ) {
      console.log(sms);
    }
    return;
  }

  /**
   * 담당자에게 문자 발송
   * @param deliveryFounderConsult
   * @param admins
   * @param req
   */
  async alertAdminNotification(
    deliveryFounderConsult: DeliveryFounderConsult,
    admins: Admin[],
    req?: Request,
  ) {
    await Promise.all(
      admins.map(async admin => {
        const payload = await this.__notify_admin_for_consult(
          deliveryFounderConsult,
          admin,
        );
        req.body = payload.body;
        const sms = await aligoapi.send(req, payload.auth);
        if (
          process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT ||
          ENVIRONMENT.STAGING
        ) {
          console.log(sms);
        }
      }),
    );
    return;
  }

  /**
   * send vicinity text
   * @param deliveryFounderConsult
   * @param genderAge
   * @param category
   * @param furniture
   * @param bestSpaces
   * @param req
   */
  async sendVicinityInformation(
    deliveryFounderConsult: DeliveryFounderConsult,
    genderAge: any[],
    category: any[],
    furniture: any[],
    bestSpaces: BestSpaceMapper[],
  ) {
    const payload = await this.__send_vicinity_info(
      deliveryFounderConsult,
      genderAge,
      category,
      furniture,
      bestSpaces,
    );
    return payload;
  }

  /**
   * send edited message
   * @param phoneNo
   * @param message
   * @param req
   */
  async sendEditedMessage(phoneNo: string, message: string, req: Request) {
    const auth = await this.__get_auth();
    const body = {
      receiver: phoneNo,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: message,
      title: '[나누다키친 희망지역 상권 정보 안내]',
    };
    req.body = body;
    const sms = await aligoapi.send(req, auth);
    console.log(sms);
  }

  /**
   * landing page send message
   * @param landingPageSuccess
   * @param req
   */
  async sendLandingMessage(
    landingPageSuccess: LandingPageSuccessRecord,
    req: Request,
  ) {
    const payload = await this.__landing_page_notify_user(landingPageSuccess);
    req.body = payload.body;
    const sms = await aligoapi.send(req, payload.auth);
    if (
      process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT ||
      ENVIRONMENT.STAGING
    ) {
      console.log(sms);
    }
    return;
  }

  /**
   * 2차 대면 미팅 안내
   * @param applicant
   * @param req
   */
  async secondMeetingApplicantNotification(
    applicant: SecondMeetingApplicant,
    req: Request,
  ) {
    const payload = await this.__second_meeting_applicant_notification(
      applicant,
    );
    req.body = payload.body;
    const sms = await aligoapi.send(req, payload.auth);
    if (
      process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT ||
      ENVIRONMENT.STAGING
    ) {
      console.log(sms);
    }
    return;
  }

  /**
   * 장바구니 문자 발송
   * @param nanudaUser
   * @param consults
   * @param req
   */
  async sendCartMessageNotifcation(
    nanudaUser: NanudaUser,
    consults: DeliveryFounderConsult[],
    req: Request,
  ) {
    const payload = await this.__send_cart_message_notifcation_to_user(
      nanudaUser,
      consults,
    );
    req.body = payload.body;
    const sms = await aligoapi.send(req, payload.auth);
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      console.log(sms);
    }
    return;
  }

  /**
   * aligo api authentication
   */
  private async __get_auth(): Promise<AligoAuth> {
    const auth = new AligoAuth();
    auth.user_id = process.env.ALIGO_USER_ID;
    auth.key = process.env.ALIGO_API_KEY;
    auth.testmode_yn = process.env.ALIGO_TESTMODE;
    return auth;
  }

  /**
   * send presentation event notification
   * @param phone
   * @param name
   * @param presentationDate
   * @param schedule
   */
  private async __presentation_event_notification(
    attendees: Attendees,
  ): Promise<MessageObject> {
    const presentationDate = moment(attendees.event.presentationDate).format(
      'YYYY-MM-DD, ddd',
    );
    const auth = await this.__get_auth();
    const body = {
      receiver: attendees.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누다키친] 안녕하세요 ${attendees.name}님, 나누다키친입니다. \n나누다키친 창업 설명회에 신청해주셔서 감사드립니다. \n\n창업 설명회 안내 \n\n일시: ${presentationDate} | ${attendees.scheduleTime} \n장소: http://naver.me/5Yn0UdYx \n서울 서초구 서초대로 77길 55 에이프로스퀘어 빌딩 6층
        (강남역,신논현역 도보 이동 가능) \n※ 건물에 주차가 어려울 수 있으니 주변 공영주차장을 이용해주시면 감사하겠습니다. \n\n감사합니다. \n나누다키친 드림. \n\nTEL:02-556-5777 \n무료 거부 080-870-0727`,
      title: '안녕하세요 위대한상사입니다.',
    };

    return { body, auth };
  }

  /**
   * 1차 상담 마무리 문자
   * @param nanudaUser
   */
  private async __send_dist_complete_notification(
    deliveryFounderConsult: DeliveryFounderConsult,
  ): Promise<MessageObject> {
    const date = new Date();
    const dayOfTheWeek = date.getDay();
    // [0 - 6]
    const timeOfTheDay = date.getHours();
    console.log(dayOfTheWeek, timeOfTheDay);
    const auth = await this.__get_auth();
    let body = {};
    if ((dayOfTheWeek === 5 && timeOfTheDay > 19) || dayOfTheWeek === 6 || 0) {
      body = {
        receiver: deliveryFounderConsult.nanudaUser.phone,
        sender: process.env.ALIGO_SENDER_PHONE,
        msg: `안녕하세요. 나누다키친입니다. \n${deliveryFounderConsult.deliverySpace.companyDistrict.company.nameKr}의 공유주방의 상담 문의를 남겨주셔서 감사합니다. \n전문 상담사를 빠르게 배정하여 월요일 오전까지 연라드리겠습니다. \n나누다키친은 창업 공간 매칭부터 브랜드 창업까지 원스톱으로 창업 솔루션을 제공하는 \n전문 기업입니다. \n(총 매칭 신청 누적 건수 1,032건) \n공유주방 상담 문의를 남겨주신 분들에 한해 아래의 혜택을 제공하고 있습니다. \n***나누다키친만의 창업 혜택*** \n1) 계약 시 창업 지원금 등의 파격적인 혜택 제공 \n2) 빅데이터 기반으로 최적의 공유주방 입점상담 진행(비교분석 서비스 제공) \n3) 나누다키친 브랜드로 창업 시 가맹비 면제 및 배달창업 컨설팅 서비스 제공(선착순) \n(배달앱광고, 마케팅, 홍보물, 교육 등 지원)`,
        title: '[나누다키친 공유주방 유선상담 안내]',
      };
    } else {
      body = {
        receiver: deliveryFounderConsult.nanudaUser.phone,
        sender: process.env.ALIGO_SENDER_PHONE,
        msg: `안녕하세요. 나누다키친입니다. \n${deliveryFounderConsult.deliverySpace.companyDistrict.company.nameKr}의 상담 문의를 남겨주셔서 감사합니다. \n현재 전문 상담사가 배정되어 빠른 시간 내로 연락드리겠습니다. \n나누다키친은 창업 공간 매칭부터 브랜드 창업까지 원스톱으로 창업 솔루션을 제공하는 \n전문 기업입니다. \n(총 매칭 신청 누적 건수 1,032건) \n공유주방 상담 문의를 남겨주신 분들에 한해 아래의 혜택을 제공하고 있습니다. \n***나누다키친만의 창업 혜택*** \n1) 계약 시 창업 지원금 등의 파격적인 혜택 제공 \n2) 빅데이터 기반으로 최적의 공유주방 입점상담 진행(비교분석 서비스 제공) \n3) 나누다키친 브랜드로 창업 시 가맹비 면제 및 배달창업 컨설팅 서비스 제공(선착순) \n(배달앱광고, 마케팅, 홍보물, 교육 등 지원)`,
        title: '[나누다키친 공유주방 유선상담 안내]',
      };
    }
    return { body, auth };
  }

  private async __notify_admin_for_consult(
    deliveryFounderConsult: DeliveryFounderConsult,
    admin: Admin,
  ): Promise<MessageObject> {
    const auth = await this.__get_auth();
    const body = {
      receiver: admin.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `${deliveryFounderConsult.nanudaUser.name}님께서 ${deliveryFounderConsult.deliverySpace.companyDistrict.company.nameKr}의 공유주방 상담 문의가 들어왔습니다. \n지점: ${deliveryFounderConsult.deliverySpace.companyDistrict.region2DepthName}. \n빠른 대응 부탁드립니다.`,
      title: '[나누다키친 공유주방 유선상담 안내]',
    };
    return { body, auth };
  }

  // landing page sms
  private async __landing_page_notify_user(
    landingPageSuccess: LandingPageSuccessRecord,
  ): Promise<MessageObject> {
    const auth = await this.__get_auth();
    const body = {
      receiver: landingPageSuccess.nonNanudaUserPhone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `안녕하세요, ${landingPageSuccess.nonNanudaUserName}님. 나누다키친입니다. \n신청해주셔서 감사합니다. \n현재 전문 상담사가 배정되어 빠른 시간 내로 연락드리겠습니다.`,
      title: '공유주방 플랫폼 [나누다키친]',
    };
    return { body, auth };
  }

  private async __send_vicinity_info(
    deliveryFounderConsult: DeliveryFounderConsult,
    genderAge: any[],
    category: any[],
    furnitureRatio: any[],
    bestSpace: BestSpaceMapper[],
  ): Promise<any> {
    let furnitureRatioUpAndDown = '';
    if (parseInt(furnitureRatio[0].max_value_column_name) === 1) {
      furnitureRatioUpAndDown = '1인 가구';
    } else if (parseInt(furnitureRatio[0].max_value_column_name) > 1) {
      furnitureRatioUpAndDown = '2인 이상 가구';
    }
    const body = {
      msg: `안녕하세요. 나누다키친입니다. \n\n1차 유선상담을 통해서 ${deliveryFounderConsult.nanudaUser.name}님의 희망창업지역 기준 상권분석을 \n안내드립니다. \n\n${deliveryFounderConsult.nanudaUser.name}님이 희망하신 ${deliveryFounderConsult.deliverySpace.companyDistrict.region3DepthName} 기준 상권분석 내용은 아래와 같습니다. \n\n1) 창업 희망 지역 내 주요 인구분포 \n${genderAge[0].max_value_column_name}/${furnitureRatioUpAndDown} \n\n2) 창업 희망 지역 내 업태별 BEST 3 \n${category[0].medium_category_nm}/${category[1].medium_category_nm}/${category[2].medium_category_nm} \n\n3) 추천 창업 공간 BEST 3 \n${bestSpace[0].deliverySpace.companyDistrict.company.nameKr} ${bestSpace[0].deliverySpace.companyDistrict.nameKr} \n${bestSpace[1].deliverySpace.companyDistrict.company.nameKr} ${bestSpace[1].deliverySpace.companyDistrict.nameKr} \n${bestSpace[2].deliverySpace.companyDistrict.company.nameKr} ${bestSpace[2].deliverySpace.companyDistrict.nameKr} \n\n자세한 상담은 2차 대면 미팅 시 안내해드리겠습니다. \n해당 상권에서 최고의 전문가와 안전한 배달 창업에 도전하세요!`,
    };
    return body;
  }

  /**
   * send presentation event notification
   * @param phone
   * @param name
   * @param presentationDate
   * @param schedule
   */
  private async __presentation_event_notification_online(
    attendees: AttendeesOnline,
  ): Promise<MessageObject> {
    const auth = await this.__get_auth();
    const todayDate = new Date(attendees.presentationDate)
      .toISOString()
      .slice(0, 10);
    const body = {
      receiver: attendees.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누다키친] 안녕하세요 ${attendees.name}님, 나누다키친입니다. \n나누다키친 온라인 창업 설명회에 신청해주셔서 감사드립니다. \n\n온라인 창업설명회 안내드립니다. \n\n날짜: ${todayDate}\n시간: ${attendees.eventTime}\n이용방법: 줌(ZOOM) 사이트 또는 앱으로 간편하게 화상으로 창업설명회에 참여 가능합니다.\n\n문의사항이 있으신 경우 해당 번호로 연락주시면 상담 도와드리겠습니다.\n\n나누다키친 영업시간 : 평일 10시~18시\n감사합니다 \n나누다키친 드림. \n\nTEL: ${process.env.ALIGO_SECONDARY_PHONE}`,
      title: '안녕하세요 나누다키친입니다.',
    };

    return { body, auth };
  }

  /**
   * send presentation event notification
   * @param phone
   * @param name
   * @param presentationDate
   * @param schedule
   */
  private async __second_meeting_applicant_notification(
    applicant: SecondMeetingApplicant,
  ): Promise<MessageObject> {
    const auth = await this.__get_auth();
    // const todayDate = new Date(attendees.presentationDate)
    // .toISOString()
    // .slice(0, 10);
    const body = {
      receiver: applicant.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누다키친] 안녕하세요 ${applicant.name}님, 나누다키친입니다. \n나누다키친 온라인 창업 설명회 2부 상담신청이 완료되었습니다. \n\n[2부 설명회 안내]\n> 빅데이터 상권분석\n> 깃발 컨설팅\n> 공유주방 매칭\n> 브랜드 상세설명\n\n*2부는 1:1 맞춤 상담으로 진행됩니다.\n\n담당자분이 최대한 빠른 시일 내 연락드려 미팅 안내를 드릴 예정입니다.\n\n2부 상담이 완료된 분들에 한하여 추첨하여 뿌링클 쿠폰을 드리고 있으니 예비사장님들은 꼭 참석해주세요!\n기타 궁금하신 부분이 있으시면 ${process.env.ALIGO_SECONDARY_PHONE}로 연락주시면 응대 도와드립니다.\n\n나누다키친 영업시간: 평일 10시 ~ 18시\n감사합니다.`,
      title: '안녕하세요 나누다키친입니다.',
    };

    return { body, auth };
  }

  /**
   * notification to user
   * @param nanudaUser
   * @param consults
   */
  private async __send_cart_message_notifcation_to_user(
    nanudaUser: NanudaUser,
    consults: DeliveryFounderConsult[],
  ): Promise<MessageObject> {
    const auth = await this.__get_auth();
    const spaces = [];
    consults.map(consult => {
      const promotions = [];
      if (
        consult.deliverySpace.companyDistrict.promotions &&
        consult.deliverySpace.companyDistrict.promotions.length > 0
      ) {
        consult.deliverySpace.companyDistrict.promotions.map(promotion => {
          promotions.push(`${promotion.title}\n`);
        });
      }
      spaces.push(
        `${consult.deliverySpace.companyDistrict.company.nameKr} ${
          consult.deliverySpace.companyDistrict.nameKr
        }\n - ${consult.deliverySpace.companyDistrict.address}\n - ${
          consult.deliverySpace.size
        }평형\n${promotions.join(' ')}\n`,
      );
    });

    const body = {
      receiver: nanudaUser.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누다키친] 안녕하세요 ${
        nanudaUser.name
      }님, 공유주방 플랫폼 나누다키친입니다. \n신청해주신 공유주방 안내드립니다. \n\n ${spaces.join(
        ' ',
      )}\n\n각 공유주방 상담사가 연락을 드려 자세한 상담을 진행드릴 예정입니다. \n**공유주방 상황에 따라 연락이 일부 지연 될 수 있습니다.** `,
      title: '안녕하세요 나누다키친입니다.',
    };

    return { auth, body };
  }
}
