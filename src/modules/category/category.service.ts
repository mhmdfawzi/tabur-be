import { Mapper } from '@automapper/core';
import { InjectMapper } from '@automapper/nestjs';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryDto } from 'src/dtos/categoryDto';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    @InjectMapper() private readonly classMapper: Mapper,
  ) {}

  async getAllIgnoringDeleted(): Promise<CategoryDto[]> {
    return await this.classMapper.mapArrayAsync(
      await (
        await this.categoryRepo.find({
          where: { isDeleted: false },
        })
      ).sort((x, y) => x.id - y.id),
      Category,
      CategoryDto,
    );
  }

  async getAll(): Promise<CategoryDto[]> {
    return await this.classMapper.mapArrayAsync(
      await (await this.categoryRepo.find()).sort((x, y) => x.id - y.id),
      Category,
      CategoryDto,
    );
  }

  async getById(id: number) {
    return await this.categoryRepo.findOne({ where: { id: id } });
  }

  async create(category: CategoryDto) {
    const savedCategory = await this.categoryRepo.create(category);
    return await this.categoryRepo.save(savedCategory);
  }

  async update(id: number, category: CategoryDto): Promise<boolean> {
    const updateResult = await this.categoryRepo.update(id, category);
    if (updateResult.affected) {
      return true;
    }
    return false;
  }

  // used to make a category soft deleted or enabled
  async toggle(id: number, isDelete: boolean): Promise<boolean> {
    const category = await this.categoryRepo.findOne({ where: { id: id } });
    if (category) {
      category.isDeleted = isDelete;
      const updateResult = await this.categoryRepo.update(id, category);
      if (updateResult.affected) {
        return true;
      }
    }
    return false;
  }
}
