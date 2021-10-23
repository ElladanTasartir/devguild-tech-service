import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { postgres } from './config';
import { Technology } from './modules/technology/entities/technology.entity';

const { host, username, password, database, port, logging, synchronize } =
  postgres;

export const ormConfig = {
  type: 'postgres',
  entities: [Technology],
  host,
  port,
  username,
  password,
  database,
  logging,
  synchronize,
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
} as TypeOrmModuleOptions;
