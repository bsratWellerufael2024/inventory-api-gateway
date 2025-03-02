import { IsNumber,IsString } from "@nestjs/class-validator";
export class CategoryDto {
  @IsString()
  name: string;
  @IsString()
  description:string
}