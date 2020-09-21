require('dotenv').config();
import { Injectable } from '@nestjs/common';
import * as Slack from 'slack-node';
import { BaseService } from '../base.service';
import { FounderConsult } from 'src/modules/founder-consult/founder-consult.entity';
import { SLACK_NOTIFICATION_PROPERTY } from '..';
import { CompanyUser } from 'src/modules/company-user/company-user.entity';
import { CompanyUserUpdateDto } from 'src/modules/company-user/dto';
import { Inquiry } from 'src/modules/inquiry/inquiry.entity';
import { ENVIRONMENT } from 'src/config';
import { DeliveryFounderConsult } from 'src/modules/delivery-founder-consult/delivery-founder-consult.entity';
import { DeliverySpace } from 'src/modules/delivery-space/delivery-space.entity';

@Injectable()
export class NanudaSlackNotificationService extends BaseService {
  constructor() {
    super();
  }
  slack = new Slack();
  webhookuri = process.env.PLATFORM_NOTIFICATION_SLACK_URL;

  async founderConsultStatusChange(founderConsult: DeliveryFounderConsult) {
    const message = {
      text: `방문자 신청 상태 값 변경 안내`,
      username: SLACK_NOTIFICATION_PROPERTY.founderConsultUsername,
      attachments: [
        {
          color: '#009900',
          actions: [
            {
              name: 'slack action button',
              text: '신청서 상세보기',
              type: 'button',
              url: `${process.env.ADMIN_BASEURL}delivery-founder-consult/${founderConsult.no}`,
              style: 'primary',
            },
          ],
          fields: [
            {
              title: `${SLACK_NOTIFICATION_PROPERTY.founderConsultUsername}`,
              value: `${founderConsult.deliverySpaces.companyDistrict.company.nameKr}에서 방문자 신청 ID ${founderConsult.no} 상태값을 ${founderConsult.companyDecisionStatusCode.value}로 변경했습니다.`,
              short: false,
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  /**
   * 열람 알림
   * @param founderConsult
   */
  async founderConsultOpened(founderConsult: FounderConsult) {
    const message = {
      text: `방문자 신청 열람 알림`,
      username: SLACK_NOTIFICATION_PROPERTY.founderConsultUsername,
      attachments: [
        {
          color: '#009900',
          actions: [
            {
              name: 'slack action button',
              text: '신청서 상세보기',
              type: 'button',
              url: `${process.env.ADMIN_BASEURL}delivery-founder-consult/${founderConsult.no}`,
              style: 'primary',
            },
          ],
          fields: [
            {
              title: `${SLACK_NOTIFICATION_PROPERTY.founderConsultUsername}`,
              value: `방문자 신청 아이디 ${founderConsult.no} 열람 알림입니다. \n업체: ${founderConsult.space.companyDistricts[0].company.nameKr}`,
              short: false,
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  /**
   * update user notification
   * @param companyUser
   * @param companyUserUpdateDto
   */
  async companyUserUpdateNotification(
    companyUser: CompanyUser,
    companyUserUpdateDto: CompanyUserUpdateDto,
  ) {
    const message = {
      text: '업체 사용자 정보 수정 알림',
      username: SLACK_NOTIFICATION_PROPERTY.companyUserUpdateUsername,
      attachments: [
        {
          color: '#009900',
          actions: [
            {
              name: 'slack action button',
              text: '업체 사용자 보기',
              type: 'button',
              url: `${process.env.ADMIN_BASEURL}company/company-user/${companyUser.no}`,
              style: 'primary',
            },
          ],
          fields: [
            {
              value: `${companyUser.company.nameKr}의 ${companyUser.name}님이 정보 수정했습니다.`,
              short: false,
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  /**
   *
   * @param inquiry
   */
  async systemInquiry(inquiry: Inquiry) {
    const message = {
      text: '나누다 플랫폼 시스템 문의가 생성되었습니다',
      username: SLACK_NOTIFICATION_PROPERTY.inquirySystem,
      attachments: [
        {
          color: '#009900',
          actions: [
            {
              name: 'slack action button',
              text: '문의 상세보기',
              type: 'button',
              url: `${process.env.ADMIN_BASEURL}inquiry/${inquiry.no}`,
              style: 'primary',
            },
          ],
          fields: [
            {
              title: `${inquiry.title}`,
              value: `${inquiry.company.nameKr}의 ${inquiry.companyUser.name}이 다음과 같은 시스템 문의 보내셨습니다.`,
              short: false,
            },
            {
              title: `문의사항`,
              value: `${inquiry.content}.`,
              short: false,
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  /**
   *
   * @param inquiry
   */
  async inquiryNotification(inquiry: Inquiry) {
    const message = {
      text: '나누다 플랫폼 새로운 문의가 생성되었습니다',
      username: SLACK_NOTIFICATION_PROPERTY.newInquiry,
      attachments: [
        {
          color: '#009900',
          actions: [
            {
              name: 'slack action button',
              text: '문의 상세보기',
              type: 'button',
              url: `${process.env.ADMIN_BASEURL}inquiry/${inquiry.no}`,
              style: 'primary',
            },
          ],
          fields: [
            {
              title: `제목: ${inquiry.title}`,
              value: `${inquiry.company.nameKr}의 ${inquiry.companyUser.name}님이 다음과 같은 ${inquiry.codeManagement.value}를 보내셨습니다`,
              short: false,
            },
            {
              title: `문의사항`,
              value: `${inquiry.content}`,
              short: false,
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  /**
   * 답변 슬랙
   * @param inquiry
   * @param inquiryReply
   */
  async inquiryReplyNotification(inquiry: Inquiry, inquiryReply: Inquiry) {
    const message = {
      username: SLACK_NOTIFICATION_PROPERTY.inquiryReply,
      text: `문의: ${inquiry.title} \n 답변이 생성되었습니다.`,
      attachments: [
        {
          color: '#009900',
          actions: [
            {
              name: 'slack action button',
              text: '문의 상세보기',
              type: 'button',
              url: `${process.env.ADMIN_BASEURL}inquiry/${inquiryReply.inquiryNo}`,
              style: 'primary',
            },
          ],
          fields: [
            {
              value: `${inquiryReply.company.nameKr}의 ${inquiryReply.companyUser.name}님이 문의 답변을 작성하셨습니다`,
              short: false,
            },
            {
              title: `'${inquiry.title}' 관한 답변입니다`,
              value: `${inquiryReply.content}`,
              short: false,
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  /**
   * delivery space add notification
   * @param deliverySpace
   */
  async deliverySpaceAddNotification(deliverySpace: DeliverySpace) {
    const message = {
      text: '공간 타입이 추가되었습니다',
      attachments: [
        {
          color: '#009900',
          actions: [
            {
              name: 'slack action button',
              text: '공간 타입 상세보기',
              type: 'button',
              url: `${process.env.ADMIN_BASEURL}company/delivery-space/${deliverySpace.no}`,
              style: 'primary',
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  // send notification
  private __send_slack(message: object) {
    this.slack.setWebhook(this.webhookuri);
    this.slack.webhook(message, function(err, response) {
      if (err) {
        console.log(err);
      }
    });
  }
}
