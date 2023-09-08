import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateLoginDto, CreateUserDto } from 'src/dtos/userDto';
import { UserService } from 'src/modules/user/user.service';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh-jwt-auth.guard';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiHeader,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from 'src/enums/userRole.enum';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Public()
  @Post('login')
  @ApiBody({ type: CreateLoginDto, required: true })
  @ApiOperation({ summary: 'to authenticate the user' })
  @ApiResponse({
    status: 200,
    description: 'The user authenticated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @HttpCode(HttpStatus.OK)
  async login(@Body() req: CreateLoginDto) {
    return await this.authService.login(req);
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'to register a client user' })
  @ApiBody({ type: CreateUserDto, required: true })
  async registerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto, UserRole.Customer);
  }

  @Post('register/owner')
  @ApiOperation({ summary: 'to add an owner user' })
  @ApiBody({ type: CreateUserDto, required: true })
  async registerOwnerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto, UserRole.Owner);
  }

  @Post('register/manager')
  @ApiOperation({ summary: 'to add a manager user' })
  @ApiBody({ type: CreateUserDto, required: true })
  async registerManagerUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto, UserRole.Manager);
  }

  @Post('register/admin')
  @ApiOperation({ summary: 'to add an admin user' })
  @ApiBody({ type: CreateUserDto, required: true })
  async registerAdminUser(@Body() createUserDto: CreateUserDto) {
    return await this.userService.createUser(createUserDto, UserRole.Admin);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiExcludeEndpoint()
  getProfile(@Request() req) {
    return req.user;
  }

  @ApiOperation({ summary: 'to refresh the expired token' })
  @ApiHeader({
    name: 'Authorization',
    required: true,
    description:
      'the api receive the current stored refresh token, to create another token and refresh token like the login api',
  })
  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  async refresh(@Req() request) {
    return request.user;
  }
}
