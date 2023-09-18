import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationDto } from 'src/dtos/reservationDto';
import { Reservation } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from '../../dtos/reservationDto';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectMapper() private readonly classMapper: Mapper,

    @Inject(forwardRef(() => QueueService))
    private readonly _queueService: QueueService,
  ) {}

  // for client user
  async list(): Promise<ReservationDto[]> {
    return await this.classMapper.mapArrayAsync(
      await this.reservationRepo.find({
        where: { isCancelled: false },
      }),
      Reservation,
      ReservationDto,
    );
  }

  // for admin user
  async getAll(): Promise<ReservationDto[]> {
    return await this.classMapper.mapArrayAsync(
      await this.reservationRepo.find({
        where: { isCancelled: false },
        relations: {
          reserver: true,
          queue: true,
        },
      }),
      Reservation,
      ReservationDto,
    );
  }

  async getById(id: number): Promise<ReservationDto> {
    return await this.classMapper.mapAsync(
      await this.reservationRepo.findOne({
        where: { id: id },
        relations: {
          reserver: true,
          queue: true,
        },
      }),
      Reservation,
      ReservationDto,
    );
  }

  async create(reservation: CreateReservationDto): Promise<ReservationDto> {
    const entity = this.classMapper.map(
      reservation,
      CreateReservationDto,
      Reservation,
    );
    const reservationResult = this.classMapper.mapAsync(
      await this.reservationRepo.save(entity),
      Reservation,
      ReservationDto,
    );
    const queueResult = await this._queueService.syncAddingReservationToQueue(
      reservation.queueId,
    );
    if (queueResult) {
      return reservationResult;
    } else {
      await this.reservationRepo.delete((await reservationResult).id);
      throw new HttpException(
        'Please try again later',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
  }
  async update(id: number, reservation: ReservationDto): Promise<boolean> {
    const entity = this.classMapper.map(
      reservation,
      ReservationDto,
      Reservation,
    );
    const updateResult = await this.reservationRepo.update(id, entity);
    if (updateResult.affected) {
      return true;
    }
    return false;
  }

  async toggle(id: number, isDeleted: boolean): Promise<boolean> {
    const reservation = await this.reservationRepo.findOne({
      where: { id: id },
    });
    if (reservation) {
      reservation.isCancelled = isDeleted;
      const updateResult = await this.reservationRepo.update(id, reservation);
      if (updateResult.affected) {
        return true;
      }
    }
    return false;
  }

  async makeServed(id: number): Promise<boolean> {
    const reservation = await this.reservationRepo.findOne({
      where: { id: id },
    });
    reservation.isServed = true;
    const updateResult = await this.reservationRepo.update(id, reservation);
    if (updateResult.affected) {
      return true;
    }
    return false;
  }
}
