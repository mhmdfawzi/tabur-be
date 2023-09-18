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
import { ApiOperation, ApiParam, ApiSecurity, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({
    summary:
      'to get queue details with the related provider, manager and creator',
  })
  getById(@Param('id') id: number) {
    return this._queueService.getById(id);
  }

  @Get(':id/reservations')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiParam({
    name: 'id',
    required: true,
    description: 'the queue id',
  })
  @ApiOperation({
    summary: 'to get queue details with the related reservations',
  })
  getByIdWithReservations(@Param('id') id: number) {
    return this._queueService.getByIdWithReservations(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to add a new queue',
  })
  create(@Body() _queue: CreateQueueDto) {
    return this._queueService.create(_queue);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to update a queue information',
  })
  update(@Param('id') id: number, @Body() _queue: QueueDto) {
    return this._queueService.update(id, _queue);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to make a soft delete for a queue',
  })
  delete(@Param('id') id: number) {
    return this._queueService.toggleDelete(id, true);
  }

  @Put('undoDelete/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to undo the soft delete action on a queue',
  })
  undoDelete(@Param('id') id: number) {
    return this._queueService.toggleDelete(id, false);
  }

  @Put('moveNext/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to move the queue reservations and calling the next one',
  })
  moveNext(@Param('id') id: number) {
    return this._queueService.moveNext(id);
  }

  @Put('activate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to make the queue active for reservations',
  })
  activate(@Param('id') id: number) {
    return this._queueService.toggleActivation(id, true);
  }

  @Put('deactivate/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  @ApiOperation({
    summary: 'to disable receiving reservation on a queue',
  })
  deactivate(@Param('id') id: number) {
    return this._queueService.toggleActivation(id, false);
  }
}
