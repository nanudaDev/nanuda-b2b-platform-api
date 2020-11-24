import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core';
import { EntityManager, Repository } from 'typeorm';
import { CompanyDistrict } from '../company-district/company-district.entity';
import { DeliverySpace } from '../delivery-space/delivery-space.entity';
import { MessageFloatingPopulationDto } from './dto';

@Injectable()
export class MessageDeliverySpaceService extends BaseService {
  constructor(
    @InjectEntityManager('wq') private readonly wqEntityManager: EntityManager,
    @InjectEntityManager() private readonly entityManager: EntityManager,
    @InjectRepository(DeliverySpace)
    private readonly deliverySpaceRepo: Repository<DeliverySpace>,
  ) {
    super();
  }

  /**
   * @param hCode
   */
  // 19시 ~ 08시 사이 생활인구 > 야간 생활 인구 > 10세 단위 그룹 산술평균 > 최근 6개월
  async findFloatingPopulation(companyDistrictNo: number) {
    const district = await this.entityManager
      .getRepository(CompanyDistrict)
      .findOne(companyDistrictNo);
    const query = `SELECT hdongCode, avg(M_00) AS M_00, avg(M_10) AS M_10, avg(M_20) AS M_20, avg(M_30) AS M_30, avg(M_40) AS M_40, avg(M_50) AS M_50,
    avg(F_00) AS F_00, avg(F_10) AS F_10, avg(F_20) AS F_20, avg(F_30) AS F_30, avg(F_40) AS F_40, avg(F_50) AS F_50
FROM
(SELECT date, weekday, time, hdongCode,
M00 AS M_00, M10+M15 AS M_10, M20+M25 AS M_20, M30+M35 AS M_30, M40+M45 AS M_40, M50+M55 AS M_50,
F00 AS F_00, F10+F15 AS F_10, F20+F25 AS F_20, F30+F35 AS F_30, F40+F45 AS F_40, F50+F55 AS F_50
FROM kr_seoul_living_local 
WHERE hdongCode=${district.hCode} 
AND time in (19,20,21,22,23,0,1,2,3,4,5,6,7)
AND date BETWEEN DATE_ADD(NOW(), INTERVAL -6 MONTH ) AND NOW()) A
GROUP BY hdongCode
;`;
    const floatingPopulation = await this.wqEntityManager.query(query);
    return floatingPopulation;
  }
}
