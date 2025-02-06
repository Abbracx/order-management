import {
  Controller,
  Post,
  Body,
  Param,
  Patch,
  Req,
  Get,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { OrderService } from './order.service';
import { OrderCreateInputDto, OrderUpdateInputDto } from './dto/order.dto';
import { AuthGuard } from '../common/auth.guard';

@Controller('orders')
@UseGuards(AuthGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @ApiBody({ type: OrderCreateInputDto })
  async createOrder(
    @Body() createOrderDto: OrderCreateInputDto,
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const order = await this.orderService.createOrder(createOrderDto, userId);
    return order;
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    const order = await this.orderService.getOrderById(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Patch(':id/status')
  @ApiBody({ type: OrderUpdateInputDto })
  async updateOrderStatus(
    @Param('id') id: string,
    @Body('status') status: OrderUpdateInputDto['status'],
    @Req() req: any,
  ) {
    const userId = req.user.sub;
    const order = await this.orderService.updateOrderStatus(id, status, userId);
    return order;
  }
}
