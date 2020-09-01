import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

export enum ERROR_TYPE {
  SERVER = 'SERVER',
  VALIDATOR = 'VALIDATOR',
  SERVICE = 'SERVICE',
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (process.env.NODE !== 'production') {
      console.log(exception);
    }
    const errorResponse: ErrorResponse = {
      code: exception.name,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      type: ERROR_TYPE.SERVER,
      message: `Unhandled error exception ${exception.message}`,
    };
    res.status(errorResponse.statusCode).json({
      ...errorResponse,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
    return null;
  }
}
export class ErrorResponse {
  code: string;
  statusCode: HttpStatus;
  type: ERROR_TYPE;
  message: string;
  value?: object = {};
}
