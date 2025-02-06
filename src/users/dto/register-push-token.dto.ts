import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RegisterPushTokenDto {
  @ApiProperty({ description: 'The push token of the user' })
  @IsString()
  @IsNotEmpty()
  pushToken: string;
}
