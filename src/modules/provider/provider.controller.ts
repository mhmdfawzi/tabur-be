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
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Provider')
@Controller('/api/provider')
export class ProviderController {
  constructor(private readonly _providerService: ProviderService) {}

  @Get('list')
  @Public()
  @ApiOperation({
    summary: 'to get all available providers for the customer/client',
  })
  list() {
    return this._providerService.list();
  }

  @Get(':id/queues')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'the provider id',
  })
  @ApiOperation({
    summary: 'to get a provider with the related queues',
  })
  getProviderQueues(@Param('id') id: number) {
    return this._providerService.getProviderQueues(id);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to get all available providers for the admin user',
  })
  getAll() {
    return this._providerService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to get specific provider with all details',
  })
  getById(@Param('id') id: number) {
    return this._providerService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to create a provider',
  })
  create(@Body() _provider: ProviderDto) {
    return this._providerService.create(_provider);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to update a provider info',
  })
  update(@Param('id') id: number, @Body() _provider: ProviderUpdateDto) {
    return this._providerService.update(id, _provider);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to make a soft delete action on a provider',
  })
  delete(@Param('id') id: number) {
    return this._providerService.toggle(id, true);
  }

  @Put('undoDelete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to undo the soft delete action on a provider',
  })
  undoDelete(@Param('id') id: number) {
    return this._providerService.toggle(id, false);
  }
}
