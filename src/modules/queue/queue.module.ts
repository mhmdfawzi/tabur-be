import { Module, forwardRef } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { QueueService } from './queue.service';
import { Queue } from 'src/entities/queue.entity';
import { QueueController } from './queue.controller';
import { QueueProfileMapper } from './queueProfileMapper';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Queue]),
    forwardRef(() => ReservationModule),
  ],
  controllers: [QueueController],
  providers: [QueueService, QueueProfileMapper],
  exports: [QueueService],
})
export class QueueModule {}
