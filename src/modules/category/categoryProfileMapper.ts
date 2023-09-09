/* istanbul ignore file */
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, ignore, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Category } from 'src/entities/category.entity';
import { CategoryDto } from 'src/dtos/categoryDto';

@Injectable()
export class CategoryProfileMapper extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper) => {
      createMap(mapper, Category, CategoryDto);
      createMap(
        mapper,
        CategoryDto,
        Category,
        forMember((dest) => dest.id, ignore()),
      );
    };
  }
}
