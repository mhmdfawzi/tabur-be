import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { CategoryModule } from './modules/category/category.module';
import { ProviderModule } from './modules/provider/provider.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { ConfigModule } from '@nestjs/config';
import { PostgresDBConfigService } from 'src/postgresDBConfig.Service';
import { TransformDataInterceptor } from './interceptors/transformData.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { QueueModule } from './modules/queue/queue.module';
import { ReservationModule } from './modules/reservation/reservation.module';
@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRootAsync({
      useClass: PostgresDBConfigService,
      imports: [ConfigModule],
      inject: [PostgresDBConfigService],
    }),
    AuthModule,
    RoleModule,
    CategoryModule,
    ProviderModule,
    QueueModule,
    ReservationModule,
    AutomapperModule.forRoot({ strategyInitializer: classes() }),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PostgresDBConfigService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformDataInterceptor,
    },
  ],
})
export class AppModule {
  constructor() {
    console.log(PostgresDBConfigService);
  }
}
