import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '../../dtos/categoryDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Get('all')
  getAll() {
    return this._categoryService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this._categoryService.getById(id);
  }

  @Post()
  create(@Body() _category: CategoryDto) {
    return this._categoryService.create(_category);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() _category: CategoryDto) {
    return this._categoryService.update(id, _category);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this._categoryService.remove(id);
  }
}
