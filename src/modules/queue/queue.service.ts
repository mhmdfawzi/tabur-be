import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueueDto } from 'src/dtos/queueDto';
import { Queue } from 'src/entities/queue.entity';
import { Repository } from 'typeorm';
import { CreateQueueDto } from '../../dtos/queueDto';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private readonly queueRepo: Repository<Queue>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  // for client user
  async list(): Promise<QueueDto[]> {
    return await this.classMapper.mapArrayAsync(
      await this.queueRepo.find({
        where: { isDeleted: false },
      }),
      Queue,
      QueueDto,
    );
  }

  // for admin user
  async getAll(): Promise<QueueDto[]> {
    return await this.classMapper.mapArrayAsync(
      await this.queueRepo.find({
        where: { isDeleted: false },
        relations: {
          serviceProvider: true,
          manager: true,
          createdBy: true,
        },
      }),
      Queue,
      QueueDto,
    );
  }

  async getById(id: number): Promise<QueueDto> {
    return await this.classMapper.mapAsync(
      await this.queueRepo.findOne({
        where: { id: id },
        relations: {
          serviceProvider: true,
          manager: true,
          createdBy: true,
        },
      }),
      Queue,
      QueueDto,
    );
  }

  async getByIdWithReservations(id: number): Promise<QueueDto> {
    return await this.classMapper.mapAsync(
      await this.queueRepo.findOne({
        where: { id: id },
        relations: {
          reservations: true,
        },
      }),
      Queue,
      QueueDto,
    );
  }

  async create(provider: CreateQueueDto): Promise<QueueDto> {
    const entity = this.classMapper.map(provider, CreateQueueDto, Queue);
    return this.classMapper.mapAsync(
      await this.queueRepo.save(entity),
      Queue,
      QueueDto,
    );
  }
  async update(id: number, provider: QueueDto): Promise<boolean> {
    const entity = this.classMapper.map(provider, QueueDto, Queue);
    const updateResult = await this.queueRepo.update(id, entity);
    if (updateResult.affected) {
      return true;
    }
    return false;
  }

  async toggle(id: number, isDeleted: boolean): Promise<boolean> {
    const provider = await this.queueRepo.findOne({ where: { id: id } });
    if (provider) {
      provider.isDeleted = isDeleted;
      const updateResult = await this.queueRepo.update(id, provider);
      if (updateResult.affected) {
        return true;
      }
    }
    return false;
  }

  async syncAddingReservationToQueue(queueId: number): Promise<boolean> {
    // find the queue info
    const queueDtoResult = await this.getByIdWithReservations(queueId);

    // checking the queue is active to allow reservation
    if (queueDtoResult.isActive) {
      queueDtoResult.bookCount += 1;
      // check if the next serving == 0
      queueDtoResult.nowServing =
        queueDtoResult.nowServing == 0
          ? (queueDtoResult.nowServing = queueDtoResult.reservations.find(
              (x) => x.isCancelled == false,
            )?.id)
          : queueDtoResult.nowServing; // get the current reservation id to replace queue.nowServing + 1
      // check if the now serving == 0
      if (queueDtoResult.nextServing == 0) {
        if (queueDtoResult.waitingCount >= 1) {
          queueDtoResult.nextServing =
            queueDtoResult.reservations.filter(
              (x) => x.isCancelled == false && x.isServed == false,
            ).length > 1
              ? queueDtoResult.reservations.filter(
                  (x) => x.isCancelled == false && x.isServed == false,
                )[1].id
              : 0; // get the next reservation id
        }
      }
      queueDtoResult.waitingCount =
        queueDtoResult.waitingCount == 0 ? 1 : queueDtoResult.waitingCount + 1; // get remaining reservation counts

      // update the queue info
      const updateResult = await this.queueRepo.update(
        queueDtoResult.id,
        this.classMapper.map(queueDtoResult, QueueDto, Queue),
      );
      if (updateResult.affected) {
        return true;
      }
    }
    return false;
  }
}
