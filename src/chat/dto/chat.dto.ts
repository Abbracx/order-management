import { IsString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateChatDto {
  @IsInt()
  orderId: string;
}

export class CloseChatDto {
  @IsString()
  @IsNotEmpty()
  summary: string;
}
