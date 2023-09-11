import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { AutoMap } from '@automapper/classes';
import { UserDto } from './userDto';
import { ProviderViewDto } from './providerDto';

export class QueueDto {
  @AutoMap()
  id: number;

  @IsString()
  @ApiProperty()
  @AutoMap()
  name: string;

  @AutoMap()
  createdDate: Date;

  @AutoMap()
  updatedDate: Date;

  @AutoMap()
  isDeleted: boolean;

  @AutoMap()
  nowServing: number;

  @AutoMap()
  nextServing: number;

  @AutoMap()
  bookCount: number;

  @AutoMap()
  isActive: boolean;

  @AutoMap()
  createdBy: UserDto;

  @AutoMap()
  serviceProvider: ProviderViewDto;

  @AutoMap()
  manager: UserDto;
}

export class CreateQueueDto {
  @IsString()
  @ApiProperty()
  @AutoMap()
  name: string;

  @IsNumber()
  @AutoMap()
  @ApiProperty()
  createdBy: number;

  @IsNumber()
  @AutoMap()
  @ApiProperty()
  serviceProvider: number;

  @IsNumber()
  @AutoMap()
  @ApiProperty()
  manager: number;
}

export class ViewQueueDto {
  @AutoMap()
  id: number;

  @AutoMap()
  name: string;

  @AutoMap()
  nowServing: number;

  @AutoMap()
  nextServing: number;

  @AutoMap()
  bookCount: number;

  @AutoMap()
  isActive: boolean;

  @AutoMap()
  manager: UserDto;
}
