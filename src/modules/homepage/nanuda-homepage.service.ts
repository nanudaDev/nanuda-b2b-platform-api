require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { APPROVAL_STATUS, BaseService, COMPANY, SPACE_TYPE } from 'src/core';
import { EntityManager } from 'typeorm';
import { BestSpaceMapper } from '../best-space/best-space.entity';
import { FileManagement } from '../file-management/file-management.entity';

class BestSpaceEntity {
  no: number;
  name: string;
  spaceNo: number;
  address: string;
  region1DepthName: string;
  region2DepthName: string;
  region3DepthName: string;
  images: any;
  deposit: string | number;
  monthlyRent: string | number;
  size: string | number;
  spaceTypeNo: SPACE_TYPE;
  createdAt: Date;
}
@Injectable()
export class NanudaHomepageService extends BaseService {
  constructor(
    @InjectEntityManager() private readonly entityManager: EntityManager,
  ) {
    super();
  }

  async findBestSpaces() {
    let response = [];
    const bestRestaurantKitchen = await this.entityManager
      .getRepository(BestSpaceMapper)
      .createQueryBuilder('bestSpace')
      .CustomInnerJoinAndSelect(['space'])
      .where('bestSpace.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.SPACE_SHARE,
      })
      .andWhere('space.showYn = :showYn', { showYn: YN.YES })
      .andWhere('space.delYn = :delYn', { delYn: YN.NO })
      .getMany();

    await Promise.all(
      bestRestaurantKitchen.map(async space => {
        const image = await this.entityManager
          .getRepository(FileManagement)
          .find({
            where: {
              targetTable: 'SPACE',
              targetTableNo: space.space.no,
            },
          });

        let bestSpace = new BestSpaceEntity();
        bestSpace.no = space.no;
        bestSpace.name = space.space.name;
        bestSpace.spaceNo = space.space.no;
        bestSpace.address = space.space.address;
        bestSpace.deposit = space.space.deposit;
        bestSpace.region1DepthName = space.space.sido;
        bestSpace.region2DepthName = space.space.sigungu;
        bestSpace.region3DepthName = space.space.bName2;
        bestSpace.monthlyRent = space.space.rentalFee;
        bestSpace.size = space.space.size;
        bestSpace.spaceTypeNo = SPACE_TYPE.SPACE_SHARE;
        bestSpace.images = `${process.env.EXPRESS_API_URL}/${image[0].filePath}`;
        bestSpace.createdAt = space.space.createdAt;
        response.push(bestSpace);
      }),
    );

    const bestDeliverySpace = await this.entityManager
      .getRepository(BestSpaceMapper)
      .createQueryBuilder('bestSpace')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('bestSpace.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
      })
      .andWhere('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .getMany();

    await Promise.all(
      bestDeliverySpace.map(async deliverySpace => {
        let bestSpace = new BestSpaceEntity();
        bestSpace.no = deliverySpace.no;
        bestSpace.name = `${deliverySpace.deliverySpace.companyDistrict.company.nameKr} ${deliverySpace.deliverySpace.companyDistrict.nameKr} ${deliverySpace.deliverySpace.size}평`;
        bestSpace.spaceNo = deliverySpace.deliverySpace.no;
        bestSpace.address = deliverySpace.deliverySpace.companyDistrict.address;
        bestSpace.deposit = deliverySpace.deliverySpace.deposit;
        bestSpace.monthlyRent = deliverySpace.deliverySpace.monthlyRentFee;
        bestSpace.region1DepthName =
          deliverySpace.deliverySpace.companyDistrict.region1DepthName;
        bestSpace.region2DepthName =
          deliverySpace.deliverySpace.companyDistrict.region2DepthName;
        bestSpace.region3DepthName =
          deliverySpace.deliverySpace.companyDistrict.region3DepthName;
        bestSpace.size = deliverySpace.deliverySpace.size;
        bestSpace.spaceTypeNo = SPACE_TYPE.ONLY_DELIVERY;
        bestSpace.images = `${deliverySpace.deliverySpace.images[0].endpoint}`;
        bestSpace.createdAt = deliverySpace.deliverySpace.createdAt;
        response.push(bestSpace);
      }),
    );

    // sort by primary key
    response.sort((a, b) => (a.no < b.no ? 1 : -1));
    response = response.slice(0, 6);
    return response;
  }

  /**
   * find best restaurant kitchen spaces
   */
  async findBestRestaurantSpaces() {
    const response = [];
    const bestRestaurantKitchen = await this.entityManager
      .getRepository(BestSpaceMapper)
      .createQueryBuilder('bestSpace')
      .CustomInnerJoinAndSelect(['space'])
      .where('bestSpace.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.SPACE_SHARE,
      })
      .andWhere('space.showYn = :showYn', { showYn: YN.YES })
      .andWhere('space.delYn = :delYn', { delYn: YN.NO })
      .limit(6)
      .getMany();

    await Promise.all(
      bestRestaurantKitchen.map(async space => {
        const image = await this.entityManager
          .getRepository(FileManagement)
          .find({
            where: {
              targetTable: 'SPACE',
              targetTableNo: space.space.no,
            },
          });

        let bestSpace = new BestSpaceEntity();
        bestSpace.no = space.no;
        bestSpace.name = space.space.name;
        bestSpace.spaceNo = space.space.no;
        bestSpace.address = space.space.address;
        bestSpace.deposit = space.space.deposit;
        bestSpace.region1DepthName = space.space.sido;
        bestSpace.region2DepthName = space.space.sigungu;
        bestSpace.region3DepthName = space.space.bName2;
        bestSpace.monthlyRent = space.space.rentalFee;
        bestSpace.size = space.space.size;
        bestSpace.spaceTypeNo = SPACE_TYPE.SPACE_SHARE;
        bestSpace.images = `${process.env.EXPRESS_API_URL}/${image[0].filePath}`;
        bestSpace.createdAt = space.space.createdAt;
        response.push(bestSpace);
      }),
    );
    response.sort((a, b) => (a.no < b.no ? 1 : -1));
    return response;
  }

  /**
   * find best delivery spaces
   */
  async findBestDeliverySpaces() {
    const response = [];
    const bestDeliverySpace = await this.entityManager
      .getRepository(BestSpaceMapper)
      .createQueryBuilder('bestSpace')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .innerJoinAndSelect('companyDistrict.company', 'company')
      .where('bestSpace.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
      })
      .andWhere('company.companyStatus = :companyStatus', {
        companyStatus: APPROVAL_STATUS.APPROVAL,
      })
      .andWhere(
        'companyDistrict.companyDistrictStatus = :companyDistrictStatus',
        { companyDistrictStatus: APPROVAL_STATUS.APPROVAL },
      )
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .limit(6)
      .getMany();

    await Promise.all(
      bestDeliverySpace.map(async deliverySpace => {
        let bestSpace = new BestSpaceEntity();
        bestSpace.no = deliverySpace.no;
        bestSpace.name = `${deliverySpace.deliverySpace.companyDistrict.company.nameKr} ${deliverySpace.deliverySpace.companyDistrict.nameKr} ${deliverySpace.deliverySpace.size}평`;
        bestSpace.spaceNo = deliverySpace.deliverySpace.no;
        bestSpace.address = deliverySpace.deliverySpace.companyDistrict.address;
        bestSpace.deposit = deliverySpace.deliverySpace.deposit;
        bestSpace.monthlyRent = deliverySpace.deliverySpace.monthlyRentFee;
        bestSpace.region1DepthName =
          deliverySpace.deliverySpace.companyDistrict.region1DepthName;
        bestSpace.region2DepthName =
          deliverySpace.deliverySpace.companyDistrict.region2DepthName;
        bestSpace.region3DepthName =
          deliverySpace.deliverySpace.companyDistrict.region3DepthName;
        bestSpace.size = deliverySpace.deliverySpace.size;
        bestSpace.spaceTypeNo = SPACE_TYPE.ONLY_DELIVERY;
        bestSpace.images = `${deliverySpace.deliverySpace.images[0].endpoint}`;
        bestSpace.createdAt = deliverySpace.deliverySpace.createdAt;
        response.push(bestSpace);
      }),
    );

    // sort by primary key
    response.sort((a, b) => (a.no < b.no ? 1 : -1));
    return response;
  }
}
