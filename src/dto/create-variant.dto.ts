import { IsNumber, IsString } from "@nestjs/class-validator";
export class ProductVariantDto {
  @IsNumber()
  productId:number
  
  @IsString()
  size: string;

  @IsString()
  color: string;
  
  @IsString()
  price: number;

  @IsNumber()
  weight: number;
}