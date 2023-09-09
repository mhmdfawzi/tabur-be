import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from '../../dtos/categoryDto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Category')
@Controller('/api/category')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Get('list')
  @Public()
  list() {
    return this._categoryService.getAllIgnoringDeleted();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getAll() {
    return this._categoryService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getById(@Param('id') id: number) {
    return this._categoryService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  create(@Body() _category: CategoryDto) {
    return this._categoryService.create(_category);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  update(@Param('id') id: number, @Body() _category: CategoryDto) {
    return this._categoryService.update(id, _category);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  delete(@Param('id') id: number) {
    return this._categoryService.toggle(id, true);
  }

  @Put('enable/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  enable(@Param('id') id: number) {
    return this._categoryService.toggle(id, false);
  }
}
