import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  @IsIn(['rent', 'sale'])
  type: 'rent' | 'sale';

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsArray()
  @ArrayMaxSize(15)
  @IsUrl({}, { each: true })
  imagesURL: string[];

  @IsString()
  @IsNotEmpty()
  contact: string;

  @IsDateString()
  availableAt: string;
}
