import { IsPhoneNumber, IsString, IsEmail } from 'class-validator';
import { RoleDto } from '../../role/dto/roleDto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsString()
  @ApiProperty()
  name: string;
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsString()
  @ApiProperty()
  password: string;
  @ApiProperty()
  @IsPhoneNumber()
  phone: string;
}

export class UserDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  phone: string;
  @ApiProperty()
  role: RoleDto;
}

export class UpdateUserDto {
  @IsString()
  @ApiProperty()
  name: string;
  @IsEmail()
  @ApiProperty()
  email: string;
  @IsPhoneNumber()
  @ApiProperty()
  phone: string;
}
