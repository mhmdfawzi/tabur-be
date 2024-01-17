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
import { ReservationDto, ReservationViewDto } from 'src/dtos/reservationDto';
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

  async getById(id: number): Promise<ReservationViewDto> {
    const reservation = await this.classMapper.mapAsync(
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
    // setting the waiting numbers in the queue
    const waitingNumber = await this.reservationRepo.count({
      where: {
        queue: { id: reservation.queue.id },
        isServed: false,
        isCancelled: false,
      },
    });

    return { ...reservation, waitingCount: waitingNumber };
  }

  async getByReserverId(id: number): Promise<ReservationDto[]> {
    return await this.classMapper.mapArrayAsync(
      await this.reservationRepo.find({
        where: { reserver: { id: id } },
        relations: {
          queue: true,
        },
      }),
      Reservation,
      ReservationDto,
    );
  }

  async create(reservation: CreateReservationDto): Promise<ReservationViewDto> {
    const entity = this.classMapper.map(
      reservation,
      CreateReservationDto,
      Reservation,
    );

    // setting the reservation number depending on the last reserved one
    const lastReservation = await this.reservationRepo.findOne({
      where: {
        queue: { id: reservation.queueId },
      },
      order: { id: 'DESC' },
    });

    // setting the waiting numbers in the queue
    const waitingNumber = await this.reservationRepo.count({
      where: {
        queue: { id: reservation.queueId },
        isServed: false,
        isCancelled: false,
      },
    });

    entity.number = lastReservation != null ? lastReservation.number + 1 : 1;

    const reservationResult = await this.classMapper.mapAsync(
      await this.reservationRepo.save(entity),
      Reservation,
      ReservationDto,
    );
    const queueResult = await this._queueService.syncAddingReservationToQueue(
      reservation.queueId,
    );
    if (queueResult) {
      return { ...reservationResult, waitingCount: waitingNumber };
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

  async getByQueueId(id: number): Promise<ReservationDto[]> {
    return await this.classMapper.mapArrayAsync(
      await this.reservationRepo.find({
        where: { isCancelled: false, isServed: false, queue: { id: id } },
        relations: {
          reserver: true,
        },
      }),
      Reservation,
      ReservationDto,
    );
  }
}
