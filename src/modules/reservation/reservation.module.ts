import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { Reservation } from 'src/entities/reservation.entity';
import { ReservationProfileMapper } from './reservationProfileMapper';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationProfileMapper],
})
export class ReservationModule {}
