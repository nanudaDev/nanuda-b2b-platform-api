require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { YN } from 'src/common';
import { BaseService, SPACE_TYPE } from 'src/core';
import { EntityManager } from 'typeorm';
import { BestSpaceMapper } from '../best-space/best-space.entity';
import { FileManagement } from '../file-management/file-management.entity';

class BestSpaceEntity {
  no: number;
  spaceNo: number;
  address: string;
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
        bestSpace.spaceNo = space.space.no;
        bestSpace.address = space.space.address;
        bestSpace.deposit = space.space.deposit;
        bestSpace.monthlyRent = space.space.monthlyRent;
        bestSpace.size = space.space.size;
        bestSpace.spaceTypeNo = SPACE_TYPE.SPACE_SHARE;
        bestSpace.images = `${process.env.EXPRESS_API_URL}${image[0].filePath}`;
        bestSpace.createdAt = space.space.createdAt;
        response.push(bestSpace);
      }),
    );

    const bestDeliverySpace = await this.entityManager
      .getRepository(BestSpaceMapper)
      .createQueryBuilder('bestSpace')
      .CustomInnerJoinAndSelect(['deliverySpace'])
      .innerJoinAndSelect('deliverySpace.companyDistrict', 'companyDistrict')
      .where('bestSpace.spaceTypeNo = :spaceTypeNo', {
        spaceTypeNo: SPACE_TYPE.ONLY_DELIVERY,
      })
      .andWhere('deliverySpace.showYn = :showYn', { showYn: YN.YES })
      .andWhere('deliverySpace.delYn = :delYn', { delYn: YN.NO })
      .getMany();

    await Promise.all(
      bestDeliverySpace.map(async deliverySpace => {
        let bestSpace = new BestSpaceEntity();
        bestSpace.no = deliverySpace.no;
        bestSpace.spaceNo = deliverySpace.deliverySpace.no;
        bestSpace.address = deliverySpace.deliverySpace.companyDistrict.address;
        bestSpace.deposit = deliverySpace.deliverySpace.deposit;
        bestSpace.monthlyRent = deliverySpace.deliverySpace.monthlyRentFee;
        bestSpace.size = deliverySpace.deliverySpace.size;
        bestSpace.spaceTypeNo = SPACE_TYPE.ONLY_DELIVERY;
        bestSpace.images = `${process.env.EXPRESS_API_URL}${deliverySpace.deliverySpace.images[0].endpoint}`;
        bestSpace.createdAt = deliverySpace.deliverySpace.createdAt;
        response.push(bestSpace);
      }),
    );

    // sort by primary key
    response.sort((a, b) => (a.no > b.no ? 1 : -1));
    return response;
  }
}
