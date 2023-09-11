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
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { QueueService } from './queue.service';
import { QueueDto } from 'src/dtos/queueDto';
import { CreateQueueDto } from '../../dtos/queueDto';

@ApiTags('Queue')
@Controller('/api/queue')
export class QueueController {
  constructor(private readonly _queueService: QueueService) {}

  @Get('list')
  @Public()
  list() {
    return this._queueService.list();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getAll() {
    return this._queueService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getById(@Param('id') id: number) {
    return this._queueService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  create(@Body() _queue: CreateQueueDto) {
    return this._queueService.create(_queue);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  update(@Param('id') id: number, @Body() _queue: QueueDto) {
    return this._queueService.update(id, _queue);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  delete(@Param('id') id: number) {
    return this._queueService.toggle(id, true);
  }

  @Put('enable/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  enable(@Param('id') id: number) {
    return this._queueService.toggle(id, false);
  }
}
