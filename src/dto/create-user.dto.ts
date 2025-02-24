// import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';
import { IsNotEmpty,IsNumber,IsString,Length } from "@nestjs/class-validator";
export class CreateUserDTO {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty()
  fname: string;

  @IsNotEmpty()
  @IsString()
  lname: string;

  @IsNotEmpty()
  @IsString()
  uname: string;

  @IsString()
  @Length(6)
  password: string;

  @IsString()
  role: string;
}
