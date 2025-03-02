import { IsNumber,IsString } from "@nestjs/class-validator";
export class UnitConversionDto{
   @IsString()
    baseUnit:string
    @IsString()
    containerUnit:string
    @IsNumber()
     rate:string
}