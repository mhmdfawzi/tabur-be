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
import { ProviderService } from './provider.service';
import { ProviderDto, ProviderUpdateDto } from '../../dtos/providerDto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Provider')
@Controller('/api/provider')
export class ProviderController {
  constructor(private readonly _providerService: ProviderService) {}

  @Get('list')
  @Public()
  list() {
    return this._providerService.list();
  }

  @Get(':id/queues')
  @Public()
  getProviderQueues(@Param('id') id: number) {
    return this._providerService.getProviderQueues(id);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getAll() {
    return this._providerService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getById(@Param('id') id: number) {
    return this._providerService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  create(@Body() _provider: ProviderDto) {
    return this._providerService.create(_provider);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  update(@Param('id') id: number, @Body() _provider: ProviderUpdateDto) {
    return this._providerService.update(id, _provider);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  delete(@Param('id') id: number) {
    return this._providerService.toggle(id, true);
  }

  @Put('enable/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  enable(@Param('id') id: number) {
    return this._providerService.toggle(id, false);
  }
}
