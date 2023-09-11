/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  forMember,
  ignore,
  mapFrom,
  // mapFrom,
  Mapper,
  // MappingProfile,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Provider } from 'src/entities/provider.entity';
import {
  ProviderDto,
  ProviderUpdateDto,
  ProviderViewDto,
  ProviderWithQueuesDto,
} from 'src/dtos/providerDto';

@Injectable()
export class ProviderProfileMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Provider,
        ProviderDto,
        forMember(
          (destination) => destination.owner,
          mapFrom((source) => source.owner.id),
        ),
        forMember(
          (destination) => destination.category,
          mapFrom((source) => source.category.id),
        ),
        forMember(
          (destination) => destination.createdBy,
          mapFrom((source) => source.createdBy.id),
        ),
      );
      createMap(
        mapper,
        ProviderDto,
        Provider,
        forMember((dest) => dest.id, ignore()),
        forMember(
          (destination) => destination.owner.id,
          mapFrom((source) => source.owner),
        ),
        forMember(
          (destination) => destination.category.id,
          mapFrom((source) => source.category),
        ),
        forMember(
          (destination) => destination.createdBy.id,
          mapFrom((source) => source.createdBy),
        ),
      );
      createMap(
        mapper,
        Provider,
        ProviderViewDto,
        forMember(
          (destination) => destination.owner,
          mapFrom((source) => source.owner),
        ),
        forMember(
          (destination) => destination.category,
          mapFrom((source) => source.category),
        ),
        forMember(
          (destination) => destination.createdBy,
          mapFrom((source) => source.createdBy),
        ),
        forMember(
          (destination) => destination.queues,
          mapFrom((source) => source.queues),
        ),
      );

      createMap(mapper, Provider, ProviderUpdateDto);

      createMap(
        mapper,
        ProviderUpdateDto,
        Provider,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        Provider,
        ProviderWithQueuesDto,
        forMember(
          (destination) => destination.queues,
          mapFrom((source) => source.queues),
        ),
      );

      createMap(mapper, ProviderWithQueuesDto, Provider);
    };
  }
}
