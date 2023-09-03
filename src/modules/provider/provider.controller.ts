import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ProviderService } from './provider.service';
import { ProviderDto, ProviderUpdateDto } from '../../dtos/providerDto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Provider')
@Controller('provider')
export class ProviderController {
  constructor(private readonly _providerService: ProviderService) {}

  @Get('all')
  getAll() {
    return this._providerService.getAll();
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this._providerService.getById(id);
  }

  @Post()
  create(@Body() _provider: ProviderDto) {
    return this._providerService.create(_provider);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() _provider: ProviderUpdateDto) {
    return this._providerService.update(id, _provider);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this._providerService.remove(id);
  }
}
