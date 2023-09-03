import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/dtos/userDto';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from 'src/enums/userRole.enum';
// import { RefreshJwtStrategy } from './strategies/refreshToken.strategy';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @Post('register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto, UserRole.Customer);
  }

  @Post('register/owner')
  async registerOwnerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto, UserRole.Owner);
  }

  @Post('register/manager')
  async registerManagerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto, UserRole.Manager);
  }

  @Post('register/admin')
  async registerAdminUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto, UserRole.Admin);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refrshToken(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
