import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNotEmpty, IsEnum } from 'class-validator';

export enum OrderStatus {
  Review = 'Review',
  Dispatched = 'Dispatched',
  InTransit = 'In Transit',
  Delivered = 'Delivered',
}

export class OrderCreateInputDto {
  @ApiProperty({ description: 'The item of the order' })
  @IsString()
  @IsNotEmpty()
  item: string;

  @ApiProperty({ description: 'The quantity of the order' })
  @IsString()
  @IsNotEmpty()
  quantity: string;

  @ApiProperty({ description: 'The price of the order' })
  @IsInt()
  @IsNotEmpty()
  price: number;
}

export class OrderUpdateInputDto {
  @ApiProperty({ description: 'The status of the order', enum: OrderStatus })
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status: OrderStatus;
}
