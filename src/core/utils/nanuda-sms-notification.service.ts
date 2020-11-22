import { Injectable } from '@nestjs/common';
import { AligoAuth, MessageObject } from './sms-notification.service';
import * as aligoapi from 'aligoapi';
import { Request } from 'express';
import { Attendees } from 'src/modules/attendees/attendees.entity';
import * as moment from 'moment';
import { NanudaUser } from 'src/modules/nanuda-user/nanuda-user.entity';
import { DeliveryFounderConsult } from 'src/modules/delivery-founder-consult/delivery-founder-consult.entity';

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
    console.log(sms);
    return;
  }

  async sendDeliveryFounderConsultMessage(
    deliveryFounderConsult: DeliveryFounderConsult,
    req?: Request,
  ) {
    const payload = await this.__send_dist_complete_notification(
      deliveryFounderConsult,
    );
    console.log(payload);
    req.body = payload.body;
    const sms = await aligoapi.send(req, payload.auth);
    console.log(sms);
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
      msg: `[나누디키친] 안녕하세요 ${attendees.name}님, 나누다키친입니다. \n나누다키친 창업 설명회에 신청해주셔서 감사드립니다. \n\n창업 설명회 안내 \n\n일시: ${presentationDate} | ${attendees.scheduleTime} \n장소: http://naver.me/5Yn0UdYx \n서울 서초구 서초대로 77길 55 에이프로스퀘어 빌딩 6층
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
    console.log(body);
    return { body, auth };
  }
}
