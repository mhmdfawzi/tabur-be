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
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Category')
@Controller('/api/category')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Public()
  @Get('list')
  @ApiOperation({
    summary: 'to get all categories for customer/client',
  })
  list() {
    return this._categoryService.getAllIgnoringDeleted();
  }

  @Get('all')
  @ApiOperation({
    summary: 'to get all categories for admin user',
  })
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getAll() {
    return this._categoryService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to get specific category info',
  })
  getById(@Param('id') id: number) {
    return this._categoryService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to create a category',
  })
  create(@Body() _category: CategoryDto) {
    return this._categoryService.create(_category);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to update a category',
  })
  update(@Param('id') id: number, @Body() _category: CategoryDto) {
    return this._categoryService.update(id, _category);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to make soft delete for a category',
  })
  delete(@Param('id') id: number) {
    return this._categoryService.toggle(id, true);
  }

  @Put('undoDelete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to undo soft delete action for a category',
  })
  undoDelete(@Param('id') id: number) {
    return this._categoryService.toggle(id, false);
  }
}
