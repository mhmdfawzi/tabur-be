import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CategoryDto {
  @AutoMap()
  id!: number | null;

  @IsString()
  @ApiProperty()
  @AutoMap()
  name: string;
}
