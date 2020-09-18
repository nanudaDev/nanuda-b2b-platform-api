import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/core';

@Injectable()
export class QuestionService extends BaseService {
  constructor() {
    super();
  }
}
