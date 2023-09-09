import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginResultDto, TokenPayload } from 'src/dtos/userDto';
import { CreateLoginDto } from '../../dtos/userDto';
import { jwtConstants } from '../constants/constants';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOneWithUserName(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      return user;
    }
    return null;
  }

  private async signiIn(credentials: CreateLoginDto): Promise<any> {
    const user = await this.validateUser(
      credentials.username,
      credentials.password,
    );

    if (!user) {
      throw new UnauthorizedException();
    }
    const payload: TokenPayload = this.createPayload(user);
    return { ...(await this.generateTokens(payload)), user };
  }

  private async generateTokens(payload): Promise<LoginResultDto> {
    return {
      token: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '1d',
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        secret: jwtConstants.secret,
        expiresIn: '7d',
      }),
    };
  }

  async login(credentials: CreateLoginDto): Promise<LoginResultDto> {
    const result = await this.signiIn(credentials);
    await this.updateRefreshToken(result.user.id, result.refreshToken);
    return { token: result.token, refreshToken: result.refreshToken };
  }

  private async updateRefreshToken(userId: number, refreshToken: string) {
    const hashedRefreshToken = await this.hashToken(refreshToken);
    const user = await this.userService.findOne(userId);
    user.refreshToken = hashedRefreshToken;
    await this.userService.update(userId, user);
  }

  private createPayload(user: User): TokenPayload {
    const payload: TokenPayload = {
      username: user.email,
      fullname: user.name,
      role: user.role,
      sub: user.id,
    };
    return payload;
  }

  private async hashToken(token: string): Promise<string> {
    return await bcrypt.hash(token, 10);
  }

  private async isVerifiedToken(
    passedToken: string,
    storedToken: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passedToken, storedToken);
  }

  async checkRefreshToken(refreshToken: string, payload: TokenPayload) {
    const foundUser: User = await this.userService.findOne(payload.sub);
    if (foundUser == null) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const isMatch = await this.isVerifiedToken(
      refreshToken,
      foundUser.refreshToken,
    );

    if (isMatch) {
      const payload: TokenPayload = this.createPayload(foundUser);
      const tokens: LoginResultDto = await this.generateTokens(payload);
      await this.updateRefreshToken(foundUser.id, tokens.refreshToken);
      return tokens;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }
}
