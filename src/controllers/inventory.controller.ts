import { Controller,Post,Body,Get} from "@nestjs/common";
import { RecordStockMovementDto } from "src/dto/record-stock-movement.dto";
import { Inject } from "@nestjs/common";
import { ClientProxy,Client,Transport} from "@nestjs/microservices";
import { Query } from "@nestjs/common";
@Controller('inventory')
export class InventoryController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productService: ClientProxy,
  ) {}
  @Client({
    transport: Transport.REDIS,
    options: {
      host: '127.0.0.1',
      port: 6379,
    },
  })
  client: ClientProxy;
  @Post('/record-movement')
  async recordStockMovement(@Body() dto: RecordStockMovementDto) {
    return this.client.send('movement_recorded', dto);
  }
  @Get('/summary')
  async getInventorySummary(
    @Query('filter') filter?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 2,
  ) {
    console.log('Fetching inventory summary...');
    return this.client.send('inventory.getSummary', { filter, page, limit });
  }
}