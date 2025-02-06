import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class AdminRegisterDto {
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @MinLength(8)
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;
}
