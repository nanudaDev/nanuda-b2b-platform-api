require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { YN } from 'src/common';
import { ENVIRONMENT } from 'src/config';
import { APPROVAL_STATUS, BaseService, SPACE_TYPE } from 'src/core';
import { NanudaSmsNotificationService } from 'src/core/utils';
import { GenderAgeModifier } from 'src/core/utils/gender-age.util';
import { EntityManager, Repository } from 'typeorm';
import { BestSpaceMapper } from '../best-space/best-space.entity';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { DeliveryFounderConsult } from '../delivery-founder-consult/delivery-founder-consult.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { IndexMessage } from './index-message.entity';

@Injectable()
export class MessageDeliverySpaceService extends BaseService {
  constructor(
    @InjectEntityManager('wq') private readonly wqEntityManager: EntityManager,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(DeliverySpace)
    private readonly deliverySpaceRepo: Repository<DeliverySpace>,
    private readonly nanudaSmsNotificationService: NanudaSmsNotificationService,
  ) {
    super();
  }

  /**
   * @param hCode
   */
  // 19시 ~ 08시 사이 생활인구 > 야간 생활 인구 > 10세 단위 그룹 산술평균 > 최근 6개월
  async findFloatingPopulation(hCode?: string) {
    const query = `SELECT hdongCode, @var_max_val:= GREATEST(M_00,M_10,M_20,M_30,M_40,M_50,
      F_00,F_10,F_20,F_30,F_40,F_50
                         ) AS max_value,
CASE @var_max_val WHEN M_00 THEN 'M00'
        WHEN M_10 THEN 'M10'
        WHEN M_20 THEN 'M20'
        WHEN M_30 THEN 'M30'
        WHEN M_40 THEN 'M40'
        WHEN M_50 THEN 'M50'
        WHEN F_00 THEN 'F00'
        WHEN F_10 THEN 'F10'
        WHEN F_20 THEN 'F20'
        WHEN F_30 THEN 'F30'
        WHEN F_40 THEN 'F40'
        WHEN F_50 THEN 'F50'
END AS max_value_column_name
FROM
(SELECT hdongCode, avg(M_00) AS M_00, avg(M_10) AS M_10, avg(M_20) AS M_20, avg(M_30) AS M_30, avg(M_40) AS M_40, avg(M_50) AS M_50,
avg(F_00) AS F_00, avg(F_10) AS F_10, avg(F_20) AS F_20, avg(F_30) AS F_30, avg(F_40) AS F_40, avg(F_50) AS F_50
FROM
(SELECT date, weekday, time, hdongCode,
M00 AS M_00, M10+M15 AS M_10, M20+M25 AS M_20, M30+M35 AS M_30, M40+M45 AS M_40, M50+M55 AS M_50,
F00 AS F_00, F10+F15 AS F_10, F20+F25 AS F_20, F30+F35 AS F_30, F40+F45 AS F_40, F50+F55 AS F_50
FROM wq.kr_seoul_living_local 
WHERE hdongCode=${hCode} 
AND time in (19,20,21,22,23,0,1,2,3,4,5,6,7)
AND date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()) A
GROUP BY hdongCode
) B
;`;
    const floatingPopulation = await this.wqEntityManager.query(query);
    return floatingPopulation;
  }

  /**
   * 창업 희망 지역 내 업태별 매출 Top 3 - 음식업종, 평균 가맹점수, 평균 매출건수, 평균 매출금액, 평균 객단가
   * @param bCode
   */
  async findBestFoodCategory(bCode?: string) {
    const query = `SELECT A.medium_category_cd, B.medium_category_nm, round(avg(store_cnt)) as n_stores, round(avg(cnt_store)) as cnt, round(avg(amt_store)) as amt, round(avg(amt_per_cnt)) as amt_per_cnt
    FROM 
      (select yymm, admi_cd, medium_category_cd, total_cnt, total_amt, store_cnt, total_cnt/store_cnt as cnt_store, total_amt/store_cnt as amt_store, (total_amt/store_cnt)/(total_cnt/store_cnt) as amt_per_cnt
      from kb_delivery_custumer
      where admi_cd = ${bCode} and medium_category_cd like 'F%'
      ) A
    LEFT JOIN kb_category_info B
    ON A.medium_category_cd = B.medium_category_cd
    GROUP BY medium_category_cd
    ORDER BY amt DESC
    ;`;

    const findCategory = await this.wqEntityManager.query(query);
    return findCategory;
  }

  /**
   * 가구원수별 가구 수 및 가구 비중
   * @param hCode
   */
  async findFurnitureRatio(hCode?: string) {
    const query = `SELECT hdongCode, hdongName, @var_max_val:= GREATEST(gen1Cnt, gen2Cnt, gen3Cnt, gen4Cnt, gen5Cnt, gen6Cnt, gen7Cnt) AS max_value,
    CASE @var_max_val WHEN gen1Cnt THEN '1'
                      WHEN gen2Cnt THEN '2'
                      WHEN gen3Cnt THEN '3'
                      WHEN gen4Cnt THEN '4'
                      WHEN gen5Cnt THEN '5'
                      WHEN gen6Cnt THEN '6'
                      WHEN gen7Cnt THEN '7'
    END AS max_value_column_name
    FROM wq.kr_seoul_gen 
    WHERE hdongCode = ${hCode};`;

    return await this.wqEntityManager.query(query);
  }

  /**
   * send text message
   * @param companyDistrictNo
   */
  async sendMessageAndPlaceInIndex(
    deliveryFounderConsultNo: number,
    req: Request,
  ) {
    const consult = await this.entityManager
      .getRepository(DeliveryFounderConsult)
      .createQueryBuilder('deliveryFounderConsult')
      .CustomInnerJoinAndSelect(['nanudaUser', 'deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('deliveryFounderConsult.no = :no', {
        no: deliveryFounderConsultNo,
      })
      .getOne();

    const bestDeliverySpace = await this.entityManager
      .getRepository(BestSpaceMapper)
      .createQueryBuilder('bestSpace')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('bestSpace.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
      })
      .andWhere('bestSpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .andWhere('companyDistrict.region1DepthName = :region1DepthName', {
        region1DepthName: '서울',
      })
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .andWhere('deliverySpace.remainingCount > 0')
      .limit(3)
      .getMany();

    let checkIndex = await this.wqEntityManager
      .getRepository(IndexMessage)
      .findOne({
        where: { hCode: consult.deliverySpace.companyDistrict.hCode },
      });
    if (checkIndex) {
      await this.nanudaSmsNotificationService.sendVicinityInformation(
        consult,
        checkIndex.message[0],
        checkIndex.message[1],
        checkIndex.message[2],
        bestDeliverySpace,
        req,
      );
      checkIndex.queryCount = checkIndex.queryCount + 1;
      checkIndex = await this.wqEntityManager
        .getRepository(IndexMessage)
        .save(checkIndex);
      return checkIndex.message;
    } else {
      const message = await Promise.all([
        await this.findFloatingPopulation(
          consult.deliverySpace.companyDistrict.hCode,
        ),
        await this.findBestFoodCategory(
          consult.deliverySpace.companyDistrict.bCode,
        ),
        await this.findFurnitureRatio(
          consult.deliverySpace.companyDistrict.hCode,
        ),
      ]);
      message[0].push({ type: '나이대 및 성별' });
      message[0][0].max_value_column_name = GenderAgeModifier(
        message[0][0].max_value_column_name,
      );
      // get first three elements of array
      message[1].length = 3;
      // if (message[1][0].medium_category_nm === '패스트푸드') {
      //   message[1][0].medium_category_nm = '한식';
      // }
      message[1].push({ type: '업태별' });

      const furnitureRatioData = message[2];
      furnitureRatioData.push({ type: '가구수' });
      let newIndex = new IndexMessage();
      newIndex.hCode = consult.deliverySpace.companyDistrict.hCode;
      newIndex.message = message;
      newIndex = await this.wqEntityManager
        .getRepository(IndexMessage)
        .save(newIndex);
      await this.nanudaSmsNotificationService.sendVicinityInformation(
        consult,
        message[0],
        message[1],
        furnitureRatioData,
        bestDeliverySpace,
        req,
      );
      return message;
    }
  }
}
