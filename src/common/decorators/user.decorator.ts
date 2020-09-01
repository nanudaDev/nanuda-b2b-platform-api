import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

export const UserInfo = createParamDecorator((data: string, req: Request) => {
  return data ? req.user && req.user[data] : req.user;
});

export const LegacyUserInfo = createParamDecorator((data: string, req: any) => {
  return data ? req.decoded && req.decoded[data] : req.decoded;
});
