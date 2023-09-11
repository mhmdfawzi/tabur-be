import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { Queue } from 'src/entities/queue.entity';
import { QueueController } from './queue.controller';
import { QueueProfileMapper } from './queueProfileMapper';

@Module({
  imports: [TypeOrmModule.forFeature([Queue])],
  controllers: [QueueController],
  providers: [QueueService, QueueProfileMapper],
})
export class QueueModule {}
