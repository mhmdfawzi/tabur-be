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
import { Queue } from 'src/entities/queue.entity';
import { CreateQueueDto, QueueDto, ViewQueueDto } from 'src/dtos/queueDto';

@Injectable()
export class QueueProfileMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(
        mapper,
        Queue,
        QueueDto,
        // forMember((dest) => dest.id, ignore()),
        forMember(
          (destination) => destination.manager,
          mapFrom((source) => source.manager),
        ),
        forMember(
          (destination) => destination.serviceProvider,
          mapFrom((source) => source.serviceProvider),
        ),
        forMember(
          (destination) => destination.createdBy,
          mapFrom((source) => source.createdBy),
        ),
        forMember(
          (destination) => destination.reservations,
          mapFrom((source) => source.reservations),
        ),
      );

      createMap(
        mapper,
        QueueDto,
        Queue,
        forMember((dest) => dest.id, ignore()),
      );

      createMap(
        mapper,
        CreateQueueDto,
        Queue,
        forMember((dest) => dest.id, ignore()),
        forMember(
          (destination) => destination.manager.id,
          mapFrom((source) => source.manager),
        ),
        forMember(
          (destination) => destination.createdBy.id,
          mapFrom((source) => source.createdBy),
        ),
        forMember(
          (destination) => destination.serviceProvider.id,
          mapFrom((source) => source.serviceProvider),
        ),
      );

      createMap(mapper, Queue, CreateQueueDto);

      createMap(mapper, Queue, ViewQueueDto);

      createMap(
        mapper,
        ViewQueueDto,
        Queue,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
