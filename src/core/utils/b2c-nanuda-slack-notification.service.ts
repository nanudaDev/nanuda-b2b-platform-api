require('dotenv').config();
import { Injectable } from '@nestjs/common';
import * as Slack from 'slack-node';
import { BaseService } from '../base.service';
import { DeliveryFounderConsult } from 'src/modules/delivery-founder-consult/delivery-founder-consult.entity';
import { B2C_SLACK_NOTIFICATION_PROPERTY } from 'src/shared';
import { Attendees } from 'src/modules/attendees/attendees.entity';
import * as moment from 'moment';
import { LandingPageSuccessRecord } from 'src/modules/landing-page-success-record/landing-page-success-record.entity';
import { YN } from 'src/common';

@Injectable()
export class B2CNanudaSlackNotificationService extends BaseService {
  slack = new Slack();
  webhookuri = process.env.SLACK_URL;
  presentationSlackUrl = process.env.BUSINESS_PRESENTATION_SLACK_URL;
  landingPageSlackUrl = process.env.LANDING_PAGE_SUCCESS_SLACK_URL;

  async deliveryFounderConsultAdded(
    deliveryFounderConsult: DeliveryFounderConsult,
  ) {
    const message = {
      text: `배달형 상담신청 안내`,
      username: B2C_SLACK_NOTIFICATION_PROPERTY.founderConsultUsername,
      attachments: [
        {
          color: '#009900',
          actions: [
            {
              name: 'slack action button',
              text: '신청서 상세보기',
              type: 'button',
              url: `${process.env.ADMIN_BASEURL}delivery-founder-consult/${deliveryFounderConsult.no}`,
              style: 'primary',
            },
          ],
          fields: [
            {
              title: `${B2C_SLACK_NOTIFICATION_PROPERTY.founderConsultUsername}`,
              value: `${deliveryFounderConsult.nanudaUser.name}님이 ${deliveryFounderConsult.deliverySpace.companyDistrict.company.nameKr} 업체의 ${deliveryFounderConsult.deliverySpace.typeName}에 신청을 했습니다.`,
              short: false,
            },
          ],
        },
      ],
    };
    this.__send_slack(message);
  }

  /**
   * send presentation slack
   * @param attendees
   */
  async attendeesNotification(attendees: Attendees) {
    const presentationDate = moment(attendees.event.presentationDate).format(
      'YYYY-MM-DD, ddd',
    );
    const message = {
      text: `창업 설명회 신청 안내 ${presentationDate}`,
      attachments: [
        {
          color: '#7CD197',
          fields: [
            {
              title: '신청 내용',
              value: ` - 이름: ${attendees.name} \n - 핸드폰: ${attendees.phone} \n - 시간대: ${attendees.scheduleTime} \n - 광고 유형: ${attendees.event.eventTypeInfo.value}`,
            },
          ],
        },
      ],
    };

    this.__send_presentation_slack(message);
  }

  /**
   * send landing page slack
   * @param attendees
   */
  async landingPageSuccessNotification(
    landingPageSuccessDto: LandingPageSuccessRecord,
  ) {
    const message = {
      text: `랜딩 페이지 (${landingPageSuccessDto.landingPageName}) 신청 알림`,
      attachments: [
        {
          color: '#7CD197',
          fields: [
            {
              title: '신청 내용',
              value: ` - 이름: ${
                landingPageSuccessDto.nonNanudaUserName
              } \n - 핸드폰: ${
                landingPageSuccessDto.nonNanudaUserPhone
              } \n - 기존 사용자: ${
                landingPageSuccessDto.isNanudaUser === YN.YES ? '예' : '아니오'
              }`,
            },
          ],
        },
      ],
    };

    this.__send_landing_slack(message);
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

  private __send_presentation_slack(message: object) {
    this.slack.setWebhook(this.presentationSlackUrl);
    this.slack.webhook(message, function(err, response) {
      if (err) {
        console.log(err);
      }
    });
  }

  private __send_landing_slack(message: object) {
    this.slack.setWebhook(this.landingPageSlackUrl);
    this.slack.webhook(message, function(err, response) {
      if (err) {
        console.log(err);
      }
    });
  }
}
