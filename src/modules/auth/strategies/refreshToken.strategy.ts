// // // import { PassportStrategy } from '@nestjs/passport';
// // // import { ExtractJwt, Strategy } from 'passport-jwt';
// // // import { TokenPayload } from 'src/dtos/userDto';

// // // export class RefreshJwtStrategy extends PassportStrategy(
// // //   Strategy,
// // //   'jwt-refresh',
// // // ) {
// // //   constructor() {
// // //     super({
// // //       jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
// // //       ignoreExpiration: false,
// // //       secretOrKey: `${process.env.jwt_secret}`,
// // //     });
// // //   }

// // //   async validate(payload: TokenPayload) {
// // //     return { user: payload.sub, username: payload.username };
// // //   }
// // // }

// // import { PassportStrategy } from '@nestjs/passport';
// // import { ExtractJwt, Strategy } from 'passport-jwt';
// // import { Injectable } from '@nestjs/common';

// // @Injectable()
// // export class RefreshJwtStrategy extends PassportStrategy(
// //   Strategy,
// //   'jwt-refresh',
// // ) {
// //   constructor() {
// //     super({
// //       jwtFromRequest: ExtractJwt.fromBodyField('refresh'),
// //       // ignoreExpiration: false,
// //       secretOrKey: `${process.env.jwt_secret}`,
// //       passReqToCallback: true,
// //     });
// //   }

// //   // async validate(payload: any) {
// //   //   console.log(payload);
// //   //   return { user: payload.sub, username: payload.username };
// //   // }
// //   async validate(payload: JwtPayload): Promise<User> {
// //     const { email } = payload;
// //     const user = await this.authService.getActiveUser(email);

// //     if (!user) {
// //       throw new UnauthorizedException();
// //     }

// //     return user;
// //   }
// // }

// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// import { Logger } from '@nestjs/common';
// import { UserService } from 'src/modules/user/user.service';
// import { JwtPayload } from 'src/dtos/userDto';

// @Injectable()
// export class RefreshJwtStrategy extends PassportStrategy(
//   Strategy,
//   'jwt-refresh',
// ) {
//   private readonly logger = new Logger(RefreshJwtStrategy.name);

//   constructor(
//     private readonly jwtService: JwtService,
//     private readonly usersService: UserService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromBodyField('refresh_token'),
//       ignoreExpiration: false,
//       secretOrKey: `${process.env.jwt_secret}`,
//     });
//     this.logger.warn('RefreshJwtStrategy initialized');
//   }

//   async validate(payload: JwtPayload) {
//     this.logger.warn(`Payload: ${JSON.stringify(payload)}`);
//     console.log(payload);
//     const user = await this.usersService.findOne(payload.sub);
//     if (!user) {
//       this.logger.error('User not found');
//       throw new UnauthorizedException();
//     }
//     return user;
//   }
// }
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../auth.service';
import { jwtConstants } from 'src/modules/constants/constants';
import { TokenPayload } from 'src/dtos/userDto';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'refresh-jwt-token',
) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret, //configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const refreshToken = request.header('Authorization').split(' ')[1];
    return this.authService.checkRefreshToken(refreshToken, payload);
  }
}
