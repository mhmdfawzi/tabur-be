import {
  Controller,
  Get,
  UseGuards,
  // Post,
  // Put,
  // Delete,
  // Param,
  // Body,
} from '@nestjs/common';
import { RoleService } from './role.service';
// import { RoleDto } from '../../dtos/roleDto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
// import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Role')
@Controller('/api/role')
export class RoleController {
  constructor(private readonly _roleService: RoleService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getAll() {
    return this._roleService.getAll();
  }

  // @Get(':id')
  // getById(@Param('id') id: number) {
  //   return this._roleService.getById(id);
  // }

  // @Post()
  // create(@Body() _role: RoleDto) {
  //   return this._roleService.create(_role);
  // }

  // @Put(':id')
  // update(@Param('id') id: number, @Body() _role: RoleDto) {
  //   return this._roleService.update(id, _role);
  // }

  // @Delete(':id')
  // delete(@Param('id') id: number) {
  //   return this._roleService.remove(id);
  // }
}
