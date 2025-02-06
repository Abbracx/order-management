import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength, IsNotEmpty } from 'class-validator';

export class AdminRegisterDto {
  @ApiProperty({ description: 'The username of the admin' })
  @IsNotEmpty()
  @MinLength(4)
  username: string;

  @ApiProperty({ description: 'The password of the admin' })
  @MinLength(8)
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'The email of the admin' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
