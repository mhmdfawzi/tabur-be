import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from 'src/entities/reservation.entity';
import { ReservationProfileMapper } from './reservationProfileMapper';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation]),
    forwardRef(() => QueueModule),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationProfileMapper],
  exports: [ReservationService],
})
export class ReservationModule {}
