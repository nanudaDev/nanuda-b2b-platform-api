import { Injectable } from '@nestjs/common';
import { AligoAuth } from './sms-notification.service';
import * as aligoapi from 'aligoapi';
import { Request } from 'express';
import { Attendees } from 'src/modules/attendees/attendees.entity';

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
  ): Promise<{
    body: object;
    auth: object;
  }> {
    const auth = await this.__get_auth();
    const body = {
      receiver: attendees.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[나누디키친] 안녕하세요 ${attendees.name}님, 나누다키친입니다. \n나누다키친 창업 설명회에 신청해주셔서 감사드립니다. \n\n창업 설명회 안내 \n\n일시: ${attendees.event.presentationDate} | ${attendees.scheduleTime} \n장소: http://naver.me/5Yn0UdYx \n서울 서초구 서초대로 77길 55 에이프로스퀘어 빌딩 6층
        (강남역,신논현역 도보 이동 가능) \n※ 건물에 주차가 어려울 수 있으니 주변 공영주차장을 이용해주시면 감사하겠습니다. \n\n감사합니다. \n나누다키친 드림. \n\nTEL:02-556-5777 \n무료 거부 080-870-0727`,
      title: '안녕하세요 위대한상사입니다.',
    };

    return { body, auth };
  }
}
