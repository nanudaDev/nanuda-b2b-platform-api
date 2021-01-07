require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Request } from 'express';
import * as aligoapi from 'aligoapi';
import { YN } from 'src/common';
import { AdminSendMessageDto } from 'src/modules/sms-auth/dto';
import { ENVIRONMENT } from 'src/config';
import { DeliveryFounderConsultReply } from 'src/modules/delivery-founder-consult-reply/delivery-founder-consult-reply.entity';
export class AligoAuth {
  key: string;
  user_id: string;
  testmode_yn: YN | string;
}

export class MessageObject {
  body: object;
  auth: AligoAuth;
}

@Injectable()
export class SmsNotificationService extends BaseService {
  constructor() {
    super();
  }

  /**
   * send message
   * @param req
   * @param phone
   */
  async sendLoginPrompt(req: Request, code: number): Promise<any> {
    const payload = await this.__login_prompt_message(req.body.phone, code);
    req.body = payload.body;
    await aligoapi.send(req, payload.auth);
    return;
  }

  /**
   * 1차 상담 완료 문자
   * @param phone
   * @param companyName
   * @param companyDistrictName
   * @param req
   */
  async sendConsultMessage(
    phone: string,
    companyName: string,
    companyDistrictName: string,
    req: Request,
  ) {
    const payload = await this.__send_consult_message(
      phone,
      companyName,
      companyDistrictName,
    );
    req.body = payload.body;
    const sms = await aligoapi.send(req, payload.auth);
    if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
      console.log(sms);
    }
    return;
  }

  /**
   * send message from admin
   * @param adminSendMessageDto
   * @param req
   */
  async sendAdminMessage(
    adminSendMessageDto: AdminSendMessageDto,
    req?: Request,
  ): Promise<any> {
    const auth = await this.__get_auth();
    const body = {
      receiver: adminSendMessageDto.phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[위대한상사] ${adminSendMessageDto.message}`,
      title: `${adminSendMessageDto.title}`,
    };
    req.body = body;
    await aligoapi.send(req, auth);
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
   * login prompt message
   */
  private async __login_prompt_message(
    phone: string,
    code: number,
    title?: string,
  ): Promise<MessageObject> {
    const auth = await this.__get_auth();
    const body = {
      receiver: phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[위대한상사] 로그인하기 위해 인증번호 ${code}를 입력해주세요.`,
      title: '안녕하세요 위대한상사입니다.',
    };
    return { body, auth };
  }

  private async __send_consult_message(
    phone: string,
    companyName: string,
    companyDistrictName: string,
  ): Promise<MessageObject> {
    const auth = await this.__get_auth();
    const body = {
      receiver: phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[위대한상사] 나누다키친에서 ${companyName}에 대한 1차 상담 DB를 전달하였습니다. \n지점명 : ${companyDistrictName} \n2차 상담 부탁드립니다.`,
      title: '안녕하세요 위대한상사입니다.',
    };

    return { body, auth };
  }

  // jenny랑 이야기 나눈 후
  // private async __send_consult_reply_message(
  //   phone: string,
  //   deliveryFounderConsultReply: DeliveryFounderConsultReply
  // ): Promise<MessageObject> {
  //   const auth = await this.__get_auth()
  //   const body = {
  //     receiver: phone,
  //     sender: process.env.ALIGO_SENDER_PHONE,
  //     msg: `[위대한상사] 안녕하세요. `
  //   }
  // }
}
