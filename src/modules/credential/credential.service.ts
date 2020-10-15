require('dotenv').config();
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginatedRequest, PaginatedResponse } from 'src/common';
import { BaseService } from 'src/core';
import { Repository } from 'typeorm';
import { PasswordService } from '../auth';
import { Credential } from './credential.entity';
import { AdminCredentialCreateDto, AdminCredentialListDto } from './dto';
import * as crypto from 'crypto';

@Injectable()
export class CredentialService extends BaseService {
  constructor(
    @InjectRepository(Credential)
    private readonly credentialRepo: Repository<Credential>,
  ) {
    super();
  }

  /**
   * create new credential
   * @param adminNo
   * @param adminCredentialCreateDto
   */
  async create(
    adminNo: number,
    adminCredentialCreateDto: AdminCredentialCreateDto,
  ): Promise<Credential> {
    adminCredentialCreateDto.password = this.__create_cipher(
      adminCredentialCreateDto.password,
    );
    let credential = new Credential(adminCredentialCreateDto);
    credential.adminNo = adminNo;
    credential = await this.credentialRepo.save(credential);
    return credential;
  }

  /**
   * find all for admin
   * @param adminCredentialListDto
   * @param pagination
   */
  async findAllForAdmin(
    adminCredentialListDto: AdminCredentialListDto,
    pagination: PaginatedRequest,
  ): Promise<PaginatedResponse<Credential>> {
    const qb = this.credentialRepo
      .createQueryBuilder('credential')
      .CustomLeftJoinAndSelect(['admin'])
      //   .select([
      //     'credential.name',
      //     'credential.createdAt',
      //     'credential.no',
      //     'credential.adminNo',
      //     'credential.admin',
      //   ])
      .AndWhereLike(
        'credential',
        'name',
        adminCredentialListDto.name,
        adminCredentialListDto.exclude('name'),
      )
      .AndWhereLike(
        'admin',
        'name',
        adminCredentialListDto.adminName,
        adminCredentialListDto.exclude('adminName'),
      )
      .AndWhereLike(
        'admin',
        'phone',
        adminCredentialListDto.adminPhone,
        adminCredentialListDto.exclude('adminPhone'),
      )
      .WhereAndOrder(adminCredentialListDto)
      .Paginate(pagination);

    const [items, totalCount] = await qb.getManyAndCount();

    return { items, totalCount };
  }

  /**
   * find one for admin
   * @param credentialNo
   */
  async findOneForAdmin(credentialNo: number): Promise<Credential> {
    const credential = await this.credentialRepo
      .createQueryBuilder('credential')
      .CustomLeftJoinAndSelect(['admin'])
      .where('credential.no = :no', { no: credentialNo })
      .getOne();

    return credential;
  }

  /**
   * decipher password
   * @param credentialNo
   */
  async decipher(credentialNo: number): Promise<string> {
    const credential = await this.credentialRepo.findOne(credentialNo);
    console.log(credential);
    const decipher = this.__decipher_password(credential.password);
    return decipher;
  }

  /**
   * delete for admin
   * @param credentialNo
   */
  async deleteCredential(credentialNo: number) {
    return await this.credentialRepo
      .createQueryBuilder('credential')
      .delete()
      .from(Credential)
      .where('no = :no', { no: credentialNo })
      .execute();
  }

  // TODO: upgrade to createCipheriv
  private __create_cipher(password: string) {
    let key = crypto.createCipher('aes-128-cbc', process.env.JWT_SECRET);
    let cipher = key.update(password, 'utf8', 'hex');
    cipher += key.final('hex');

    return cipher;
  }

  private __decipher_password(password: string) {
    console.log(password);
    const key = crypto.createDecipher('aes-128-cbc', process.env.JWT_SECRET);
    let decipher = key.update(password, 'hex', 'utf8');
    decipher += key.final('utf8');

    return decipher;
  }
}
