/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  ignore,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Reservation } from 'src/entities/reservation.entity';
import { CreateReservationDto, ReservationDto } from 'src/dtos/reservationDto';

@Injectable()
export class ReservationProfileMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Reservation,
        ReservationDto,
        // forMember((dest) => dest.id, ignore()),
        forMember(
          (destination) => destination.queue,
          mapFrom((source) => source.queue),
        ),
        forMember(
          (destination) => destination.reserver,
          mapFrom((source) => source.reserver),
        ),
      );

      createMap(
        mapper,
        ReservationDto,
        Reservation,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        CreateReservationDto,
        Reservation,
        forMember((dest) => dest.id, ignore()),
        forMember(
          (destination) => destination.reserver.id,
          mapFrom((source) => source.reserverId),
        ),
        forMember(
          (destination) => destination.queue.id,
          mapFrom((source) => source.queueId),
        ),
      );

      createMap(mapper, Reservation, CreateReservationDto);
    };
  }
}
