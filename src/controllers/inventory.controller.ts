import { Controller,Post,Body,Get} from "@nestjs/common";
import { RecordStockMovementDto } from "src/dto/record-stock-movement.dto";
import { Inject } from "@nestjs/common";
import { ClientProxy,Client,Transport} from "@nestjs/microservices";

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
     return this.client.send('movement_recorded',dto) 
  }

 @Get('/summary')
  async getInventorySummary() {
     console.log('📩 Fetching inventory summary...');
    return this.client.send('inventory.getSummary', {})
  }
}