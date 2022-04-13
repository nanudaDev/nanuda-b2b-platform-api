/* eslint-disable @typescript-eslint/no-unused-vars */
require('dotenv').config();
import Debug from 'debug';
import { basename } from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { json, urlencoded } from 'body-parser';
import { getConnection } from 'typeorm';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as helmet from 'helmet';
import * as packageInfo from '../package.json';
import * as requestIp from 'request-ip';
import * as csurf from 'csurf';
import * as rateLimit from 'express-rate-limit';
import { AppModule } from './app.module';
import { ClassTransformOptions } from '@nestjs/common/interfaces/external/class-transform-options.interface';
import * as generate from './generator';
import { ENVIRONMENT } from './config';

const debug = Debug(`app:${basename(__dirname)}:${basename(__filename)}`);
const env = process.env.NODE_ENV;

// require environment
if (!env) {
  console.log('No environment running');
  throw new Error('No environment running');
}
let app: NestExpressApplication;
declare const module: any;

async function bootstrap() {
  // await generate.generate;
  if (env === ENVIRONMENT.DEVELOPMENT) {
    console.log('Running in development mode. 개발 모드로 진행중');
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      // logger: true
    });
  } else {
    app = await NestFactory.create<NestExpressApplication>(AppModule, {
      logger: true,
    });
  }

  app.use(urlencoded({ extended: true }));
  app.use(json({ limit: '50mb' }));
  app.disable('x-powered-by');
  // app.setViewEngine('hbs');
  app.use(compression());
  // app.use(cookieParser());
  app.use(helmet()); // https://helmetjs.github.io/
  app.use(requestIp.mw());
  // Cors
  // see https://github.com/expressjs/cors#configuration-options
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  // app.enableCors();
  // https://docs.nestjs.com/techniques/security
  // app.use(csurf({ cookie: true }));
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10000, // limit each IP to 100 requests per windowMs
    }),
  );

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      // skipMissingProperties: true,
      // skipNullProperties: true,
      // skipUndefinedProperties: false,
      validationError: { target: false, value: false }, // object 와 value 역전송 막기
      transform: true,
      transformOptions: {
        excludeExtraneousValues: true,
      } as ClassTransformOptions, // version문제로 실제 있지만 여기 없음.. down casting
    }),
  );

  // Swagger
  if (process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION) {
    const options = new DocumentBuilder()
      .setTitle(packageInfo.name.toUpperCase())
      .setDescription(packageInfo.description)
      .setVersion(packageInfo.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(4200);

  const url = await app.getUrl();
  if (process.env.NODE_ENV === ENVIRONMENT.DEVELOPMENT) {
    Logger.log(`${url}`, 'NestApplication');
    Logger.log(`${url}/swagger`, 'NestApplication');
  }

  // HMR: Hot Reload (Webpack)
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

/**
 * Graceful shutdown
 */
// Prevents the program from closing instantly
process.stdin.resume();

async function shutdown() {
  if (app) {
    const conn = getConnection();
    debug('database connected: %o', conn.isConnected);
    if (conn.isConnected) {
      await conn.close();
      debug('database connection closed');
      debug('database connected: %o', conn.isConnected);
    }
    await app.close();
    app = null;
    debug('app closed');
    process.exit();
  }
}

// catch app is closing
process.on('exit', code => {
  console.log(`About to exit with code: ${code}`);
});

// catch ctrl+c event and exit normally
process.on('SIGINT', () => {
  console.log('SIGINT signal received.');
  shutdown();
});

// catch console is closing on windows
process.on('SIGHUP', () => {
  console.log('Got SIGHUP signal.');
  shutdown();
});

// catch "kill pid"
process.on('SIGUSR1', () => {
  console.log('Got SIGUSR1 signal.');
  shutdown();
});
process.on('SIGUSR2', () => {
  console.log('Got SIGUSR2 signal.');
  shutdown();
});

// catch uncaught exceptions
// process.on('uncaughtException', err => {
//   console.error('uncaughtException', err);
//   shutdown();
// });

bootstrap();
