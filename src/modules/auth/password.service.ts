import { BaseService } from '../../core';
import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';

const bcryptSaltRounds = 10;

@Injectable()
export class PasswordService extends BaseService {
  constructor() {
    super();
  }

  /**
   * compare password for validation
   * @param password
   * @param hashedPassword
   */
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await compare(password, hashedPassword);
  }

  /**
   * hash password
   * @param password
   */
  async hashPassword(password: string) {
    return await hash(password, bcryptSaltRounds);
  }
}
