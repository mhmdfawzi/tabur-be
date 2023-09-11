import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { UserDto } from './userDto';
import { QueueDto } from './queueDto';

export class ReservationDto {
  @AutoMap()
  id: number;

  @AutoMap()
  createdDate: Date;

  @AutoMap()
  cancelationDate: Date;

  @AutoMap()
  isCancelled: boolean;

  @AutoMap()
  reserver: UserDto;

  @AutoMap()
  queue: QueueDto;
}

export class CreateReservationDto {
  @IsNumber()
  @ApiProperty()
  @AutoMap()
  reserverId: number;

  @IsNumber()
  @ApiProperty()
  @AutoMap()
  queueId: number;
}
