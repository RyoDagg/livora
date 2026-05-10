import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  price: number;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsIn(['rent', 'sale'])
  @IsNotEmpty()
  type: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  imagesURL: string[];

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsDateString()
  @IsNotEmpty()
  availableAt: string;
}
