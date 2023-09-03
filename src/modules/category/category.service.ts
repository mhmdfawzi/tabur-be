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
  ) {}

  async getAll(): Promise<CategoryDto[]> {
    return (await this.categoryRepo.find({ where: { isDeleted: false } })).sort(
      (x, y) => x.id - y.id,
    );
  }

  async getById(id: number) {
    return await this.categoryRepo.findOne({ where: { id: id } });
  }

  async create(category: CategoryDto) {
    const savedCategory = await this.categoryRepo.create(category);
    return await this.categoryRepo.save(savedCategory);
  }
  async update(id: number, category: CategoryDto) {
    return await this.categoryRepo.update(id, category);
  }
  async remove(id: number) {
    const category = await this.categoryRepo.findOne({ where: { id: id } });
    if (category) {
      category.isDeleted = true;
      await this.categoryRepo.update(id, category);
      return true;
    } else {
      return false;
    }
  }
}
