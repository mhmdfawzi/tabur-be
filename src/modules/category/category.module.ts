import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryController } from './category.controller';
import { Category } from 'src/entities/category.entity';
import { CategoryService } from './category.service';
import { CategoryProfileMapper } from './categoryProfileMapper';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryProfileMapper],
})
export class CategoryModule {}
