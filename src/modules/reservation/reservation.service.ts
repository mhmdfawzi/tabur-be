import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationDto } from 'src/dtos/reservationDto';
import { Reservation } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from '../../dtos/reservationDto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectMapper() private readonly classMapper: Mapper,
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

  async create(provider: CreateReservationDto): Promise<ReservationDto> {
    const entity = this.classMapper.map(
      provider,
      CreateReservationDto,
      Reservation,
    );
    return this.classMapper.mapAsync(
      await this.reservationRepo.save(entity),
      Reservation,
      ReservationDto,
    );
  }
  async update(id: number, provider: ReservationDto): Promise<boolean> {
    const entity = this.classMapper.map(provider, ReservationDto, Reservation);
    const updateResult = await this.reservationRepo.update(id, entity);
    if (updateResult.affected) {
      return true;
    }
    return false;
  }

  async toggle(id: number, isDeleted: boolean): Promise<boolean> {
    const provider = await this.reservationRepo.findOne({ where: { id: id } });
    if (provider) {
      provider.isCancelled = isDeleted;
      const updateResult = await this.reservationRepo.update(id, provider);
      if (updateResult.affected) {
        return true;
      }
    }
    return false;
  }
}
