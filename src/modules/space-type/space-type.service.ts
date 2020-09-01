import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceType } from './space-type.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { YN } from 'src/common';

@Injectable()
export class SpaceTypeService extends BaseService {
  constructor(
    @InjectRepository(SpaceType)
    private readonly spaceTypeRepo: Repository<SpaceType>,
  ) {
    super();
  }

  /**
   * find all space type
   */
  async findAll(): Promise<SpaceType[]> {
    return await this.spaceTypeRepo.find({
      where: {
        delYn: YN.NO,
      },
    });
  }
}
