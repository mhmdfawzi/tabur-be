import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { CategoryModule } from './modules/category/category.module';

import config from 'ormconfig';
import { ProviderModule } from './modules/provider/provider.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ConfigModule } from '@nestjs/config';
import { PostgresDBConfigService } from './PostgresDBConfigService';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRootAsync({
      useClass: PostgresDBConfigService,
      imports: [ConfigModule],
    }),
    AuthModule,
    RoleModule,
    CategoryModule,
    ProviderModule,
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],

  providers: [AppService],
})
export class AppModule {
  constructor() {
    console.log('config', config);
  }
}
