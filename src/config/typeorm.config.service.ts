/* eslint-disable @typescript-eslint/no-unused-vars */
import Debug from 'debug';
import { basename } from 'path';
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
// for webpack:hmr
import { getMetadataArgsStorage } from 'typeorm';
require('dotenv').config();
const debug = Debug(`app:${basename(__dirname)}:${basename(__filename)}`);
const env = process.env;
@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'mysql',
      host: env.DB_HOST,
      port: Number(env.DB_PORT),
      username: env.DB_USERNAME,
      password: env.DB_PASSWORD,
      database: env.DB_DATABASE,
      keepConnectionAlive: true,
      bigNumberStrings: false,
      supportBigNumbers: false,
      entities: getMetadataArgsStorage().tables.map(tbl => tbl.target),
      synchronize: false,
    };
  }
}
