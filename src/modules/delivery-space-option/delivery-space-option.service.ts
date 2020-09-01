import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseService } from 'src/core';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliverySpaceOption } from './delivery-space-option.entity';
import { Repository } from 'typeorm';
import {
  AdminDeliverySpaceOptionCreateDto,
  AdminDeliverySpaceOptionUpdateeDto,
} from './dto';

@Injectable()
export class DeliverySpaceOptionService extends BaseService {
  constructor(
    @InjectRepository(DeliverySpaceOption)
    private readonly deliverySpaceOptionRepo: Repository<DeliverySpaceOption>,
  ) {
    super();
  }

  /**
   * find all
   */
  async findAll(): Promise<DeliverySpaceOption[]> {
    return await this.deliverySpaceOptionRepo.find();
  }

  /**
   * create option
   * @param adminNo
   * @param adminDeliverySpaceOptionCreateDto
   */
  async create(
    adminNo: number,
    adminDeliverySpaceOptionCreateDto: AdminDeliverySpaceOptionCreateDto,
  ): Promise<DeliverySpaceOption> {
    let option = new DeliverySpaceOption(adminDeliverySpaceOptionCreateDto);
    option.adminNo = adminNo;
    option = await this.deliverySpaceOptionRepo.save(option);
    return option;
  }

  /**
   * update option by admin
   * @param adminNo
   * @param deliverySpaceOptionNo
   * @param adminDeliverySpaceOptionUpdateDto
   */
  async update(
    adminNo: number,
    deliverySpaceOptionNo: number,
    adminDeliverySpaceOptionUpdateDto: AdminDeliverySpaceOptionUpdateeDto,
  ): Promise<DeliverySpaceOption> {
    let updateOption = await this.deliverySpaceOptionRepo.findOne(
      deliverySpaceOptionNo,
    );
    if (!updateOption) {
      throw new NotFoundException();
    }
    updateOption = updateOption.set(adminDeliverySpaceOptionUpdateDto);
    updateOption.adminNo = adminNo;
    return await this.deliverySpaceOptionRepo.save(updateOption);
  }
}
