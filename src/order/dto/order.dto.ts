import { IsString, IsInt, IsNotEmpty, IsEnum } from 'class-validator';

export class OrderCreateInputDto {
  @IsString()
  @IsNotEmpty()
  item: string;

  @IsString()
  @IsNotEmpty()
  quantity: string;

  @IsInt()
  @IsNotEmpty()
  price: number;
}

export class OrderUpdateInputDto {
  @IsNotEmpty()
  @IsEnum(['Review', 'Dispatched', 'In Transit', 'Delivered'])
  status: string;
}
