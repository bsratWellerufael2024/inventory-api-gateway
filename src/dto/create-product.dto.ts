import { IsNumber, IsString, IsOptional } from '@nestjs/class-validator';

export class ProductDto {
  @IsNumber()
  productId: number;

  @IsString()
  productName: string;

  @IsString()
  specification: string;

  @IsString()
  baseUnit: string;

  @IsNumber()
  openingQty: number;

  @IsNumber()
  cost_price: number;

  @IsNumber()
  selling_price: number;

  @IsOptional() 
  @IsNumber()
  category?: string;
}
