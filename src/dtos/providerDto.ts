import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsPhoneNumber, IsNumber, IsBoolean } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { UserDto } from './userDto';
import { CategoryDto } from './categoryDto';

export class ProviderDto {
  @AutoMap()
  id!: number | null;

  @AutoMap()
  @IsString()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  @IsNumber()
  owner: number;

  @AutoMap()
  @ApiProperty()
  @IsNumber()
  category: number;

  @ApiProperty()
  @AutoMap()
  @IsNumber()
  long: number;

  @AutoMap()
  @ApiProperty()
  @IsNumber()
  lat: number;

  @AutoMap()
  @ApiProperty()
  @IsNumber()
  createdBy: number;

  @AutoMap()
  @ApiProperty()
  @IsString()
  address: string;

  @AutoMap()
  @IsPhoneNumber()
  @ApiProperty()
  phone: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  description: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  logo: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  workingDays: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  workingHours: string;
}

export class ProviderUpdateDto {
  @AutoMap()
  id!: number | null;

  @AutoMap()
  @IsString()
  @ApiProperty()
  name: string;

  @ApiProperty()
  @AutoMap()
  @IsNumber()
  long: number;

  @AutoMap()
  @ApiProperty()
  @IsNumber()
  lat: number;

  @AutoMap()
  @ApiProperty()
  @IsString()
  address: string;

  @AutoMap()
  @IsPhoneNumber()
  @ApiProperty()
  phone: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  description: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  logo: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  workingDays: string;

  @AutoMap()
  @ApiProperty()
  @IsString()
  workingHours: string;

  @AutoMap()
  @ApiProperty()
  @IsBoolean()
  isPublished: boolean;

  @AutoMap()
  @ApiProperty()
  @IsBoolean()
  isSubscribed: boolean;
}

export class ProviderViewDto {
  @AutoMap()
  id!: number | null;

  @AutoMap()
  name: string;

  @AutoMap()
  owner: UserDto;

  @AutoMap()
  category: CategoryDto;

  @AutoMap()
  long: number;

  @AutoMap()
  lat: number;

  @AutoMap()
  createdBy: UserDto;

  @AutoMap()
  address: string;

  @AutoMap()
  phone: string;

  @AutoMap()
  description: string;

  @AutoMap()
  logo: string;

  @AutoMap()
  workingDays: string;

  @AutoMap()
  workingHours: string;
}
