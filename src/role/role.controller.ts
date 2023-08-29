import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleDto } from './dto/roleDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role')
@Controller('role')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get('all')
  getAll() {
    return this._roleService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this._roleService.getById(id);
  }

  @Post()
  create(@Body() _role: RoleDto) {
    return this._roleService.create(_role);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() _role: RoleDto) {
    return this._roleService.update(id, _role);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this._roleService.remove(id);
  }
}
