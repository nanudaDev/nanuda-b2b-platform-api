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
import { B2C_SLACK_NOTIFICATION_PROPERTY } from 'src/shared';

@Injectable()
export class B2CNanudaSlackNotificationService extends BaseService {
  constructor() {
    super();
  }
  slack = new Slack();
  webhookuri = process.env.SLACK_URL;

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
              value: `${deliveryFounderConsult.nanudaUser.name}님이 ${deliveryFounderConsult.deliverySpaces.companyDistrict.company.nameKr} 업체의 ${deliveryFounderConsult.deliverySpaces.typeName}에 신청을 했습니다.`,
              short: false,
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
