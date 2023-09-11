import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Provider } from 'src/entities/provider.entity';
import { User } from 'src/entities/user.entity';
import { Queue } from './entities/queue.entity';
import { Reservation } from './entities/reservation.entity';
@Injectable()
export class PostgresDBConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    console.log(process.env.npm_lifecycle_event);
    if (process.env.npm_lifecycle_event === 'start:dev') {
      return {
        type: 'postgres',
        database: 'testDB',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        entities: [User, Category, Provider, Queue, Reservation],
        synchronize: true,
      };
    } else {
      return {
        type: 'postgres',
        database: this.configService.get<string>('DATABASE_NAME'),
        host: this.configService.get<string>('DATABASE_HOST'),
        port: this.configService.get<number>('DATABASE_PORT'),
        username: this.configService.get<string>('DATABASE_USERNAME'),
        password: this.configService.get<string>('DATABASE_PASSWORD'),
        entities: [User, Category, Provider, Queue, Reservation],
        synchronize: true,
      };
    }
  }
}
