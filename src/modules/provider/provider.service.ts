import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProviderDto,
  ProviderUpdateDto,
  ProviderViewDto,
  ProviderWithQueuesDto,
} from 'src/dtos/providerDto';
import { Provider } from 'src/entities/provider.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProviderService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepo: Repository<Provider>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  // for client user
  async list(): Promise<ProviderViewDto[]> {
    return await this.classMapper.mapArrayAsync(
      await this.providerRepo.find({
        where: { isDeleted: false },
      }),
      Provider,
      ProviderViewDto,
    );
  }

  // for admin user
  async getAll(): Promise<ProviderViewDto[]> {
    return await this.classMapper.mapArrayAsync(
      await this.providerRepo.find({
        where: { isDeleted: false },
        relations: {
          category: true,
          owner: true,
          createdBy: true,
        },
      }),
      Provider,
      ProviderViewDto,
    );
  }

  async getById(id: number): Promise<ProviderViewDto> {
    return await this.classMapper.mapAsync(
      await this.providerRepo.findOne({
        where: { id: id },
        relations: {
          category: true,
          owner: true,
          createdBy: true,
        },
      }),
      Provider,
      ProviderViewDto,
    );
  }

  async create(provider: ProviderDto): Promise<ProviderDto> {
    const entity = this.classMapper.map(provider, ProviderDto, Provider);
    return this.classMapper.mapAsync(
      await this.providerRepo.save(entity),
      Provider,
      ProviderDto,
    );
  }
  async update(id: number, provider: ProviderUpdateDto): Promise<boolean> {
    const entity = this.classMapper.map(provider, ProviderUpdateDto, Provider);
    const updateResult = await this.providerRepo.update(id, entity);
    if (updateResult.affected) {
      return true;
    }
    return false;
  }

  async toggle(id: number, isDeleted: boolean): Promise<boolean> {
    const provider = await this.providerRepo.findOne({ where: { id: id } });
    if (provider) {
      provider.isDeleted = isDeleted;
      const updateResult = await this.providerRepo.update(id, provider);
      if (updateResult.affected) {
        return true;
      }
    }
    return false;
  }

  // business functionality
  // get service provider queues
  async getProviderQueues(id: number): Promise<ProviderWithQueuesDto> {
    return await this.classMapper.mapAsync(
      await this.providerRepo.findOne({
        where: { id: id },
        relations: {
          queues: true,
        },
      }),
      Provider,
      ProviderWithQueuesDto,
    );
  }
}
