import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  // Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from '../../dtos/userDto';
import { UserService } from './user.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('all')
  @ApiSecurity('JWT-auth')
  getAll() {
    return this.userService.findUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/all/managers/:providerId')
  @ApiSecurity('JWT-auth')
  getAllManagersByProviderId(@Param('providerId') providerId: number) {
    return this.userService.findManagersByProviderId(providerId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/free/managers/:providerId')
  @ApiSecurity('JWT-auth')
  getFreeManagersByProviderId(@Param('providerId') providerId: number) {
    return this.userService.findFreeManagersByProviderId(providerId);
  }

  @Get(':id')
  getById(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.createUser(createUserDto);
  // }

  @Put(':id')
  update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  // @UseGuards(JwtGuard)
  // @Get(':id/comments')
  // getUserComment(@Param('id') id: string) {
  // }
}
