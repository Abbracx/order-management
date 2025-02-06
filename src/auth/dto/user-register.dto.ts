import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class UserRegisterDto {
  @ApiProperty({ description: 'The username of the user' })
  @IsString()
  @MinLength(4)
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'The email of the user' })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
