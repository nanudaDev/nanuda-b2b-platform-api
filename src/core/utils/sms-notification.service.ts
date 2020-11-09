require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { BaseService } from '../base.service';
import { Request } from 'express';
import * as aligoapi from 'aligoapi';
import { YN } from 'src/common';
import { Admin } from 'src/modules/admin/admin.entity';
import { AdminSendMessageDto } from 'src/modules/sms-auth/dto';
export class AligoAuth {
  key: string;
  user_id: string;
  testmode_yn: YN | string;
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
  ): Promise<{
    body: object;
    auth: object;
  }> {
    const auth = await this.__get_auth();
    const body = {
      receiver: phone,
      sender: process.env.ALIGO_SENDER_PHONE,
      msg: `[위대한상사] 로그인하기 위해 인증번호 ${code}를 입력해주세요.`,
      title: '안녕하세요 위대한상사입니다.',
    };
    return { body, auth };
  }
}
