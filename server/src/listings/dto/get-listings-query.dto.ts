import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class GetListingsQueryDto {
  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsIn(['rent', 'sale'])
  type?: 'rent' | 'sale';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceMax?: number;

  @IsOptional()
  @IsString()
  ownerId?: string;

  @IsOptional()
  @IsString()
  query?: string;
}
