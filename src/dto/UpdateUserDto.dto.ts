import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  fname?: string;

  @IsOptional()
  @IsString()
  lname?: string;

  @IsOptional()
  @IsString()
  uname?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string;
}
