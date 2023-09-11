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
import { ReservationService } from './reservation.service';
import { CreateReservationDto, ReservationDto } from 'src/dtos/reservationDto';

@ApiTags('Reservation')
@Controller('/api/reservation')
export class ReservationController {
  constructor(private readonly _reservationService: ReservationService) {}

  @Get('list')
  @Public()
  list() {
    return this._reservationService.list();
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getAll() {
    return this._reservationService.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  getById(@Param('id') id: number) {
    return this._reservationService.getById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  create(@Body() _reservation: CreateReservationDto) {
    return this._reservationService.create(_reservation);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  update(@Param('id') id: number, @Body() _reservation: ReservationDto) {
    return this._reservationService.update(id, _reservation);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  delete(@Param('id') id: number) {
    return this._reservationService.toggle(id, true);
  }

  @Put('enable/:id')
  @UseGuards(JwtAuthGuard)
  @ApiSecurity('JWT-auth')
  enable(@Param('id') id: number) {
    return this._reservationService.toggle(id, false);
  }
}
