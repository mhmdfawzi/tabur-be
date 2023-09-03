import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { ProviderController } from './provider.controller';
import { ProviderService } from './provider.service';
import { Provider } from 'src/entities/provider.entity';
import { ProviderProfileMapper } from './providerProfileMapper';

@Module({
  imports: [TypeOrmModule.forFeature([Provider])],
  controllers: [ProviderController],
  providers: [ProviderService, ProviderProfileMapper],
})
export class ProviderModule {}
