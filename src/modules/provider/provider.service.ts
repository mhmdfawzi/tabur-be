import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ProviderDto,
  ProviderUpdateDto,
  ProviderViewDto,
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

  async getById(id: number) {
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

  async create(provider: ProviderDto) {
    const entity = this.classMapper.map(provider, ProviderDto, Provider);
    return this.classMapper.mapAsync(
      await this.providerRepo.save(entity),
      Provider,
      ProviderDto,
    );
  }
  async update(id: number, provider: ProviderUpdateDto) {
    const entity = this.classMapper.map(provider, ProviderUpdateDto, Provider);
    return await this.providerRepo.update(id, entity);
  }
  async remove(id: number) {
    const provider = await this.providerRepo.findOne({ where: { id: id } });
    if (provider) {
      provider.isDeleted = true;
      await this.providerRepo.update(id, provider);
      return true;
    } else {
      return false;
    }
  }
}
