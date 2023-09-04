import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Provider } from 'src/entities/provider.entity';
import { Role } from 'src/entities/role.entity';
import { User } from 'src/entities/user.entity';
@Injectable()
export class PostgresDBConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    console.log(process.env.NODE_ENV);
    return {
      type: 'postgres',
      database: this.configService.get<string>('DATABASE_NAME') || 'testDB',
      host: this.configService.get<string>('DATABASE_HOST') || 'localhost',
      port: this.configService.get<number>('DATABASE_PORT') || 5432,
      username:
        this.configService.get<string>('DATABASE_USERNAME') || 'postgres',
      password:
        this.configService.get<string>('DATABASE_PASSWORD') || 'postgres',
      entities: [User, Role, Category, Provider],
      synchronize: true,
    };
  }
}
