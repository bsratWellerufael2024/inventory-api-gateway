import { IsNumber,IsString } from "@nestjs/class-validator";
export class CategoryDto {
  @IsString()
  category: string;
  @IsString()
  description:string
}