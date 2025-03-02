import { Body, Controller ,Post,Get,} from "@nestjs/common";
import { Inject, Param } from "@nestjs/common";
import { ClientProxy,Client,Transport } from "@nestjs/microservices";
@Controller('unit-conversion')
export class UnitConversionController {
  constructor(
    @Inject('PRODUCT_SERVICE')
    private readonly unitConverionService: ClientProxy,
  ) {}
  @Client({
    transport: Transport.REDIS,
    options: {
      host: '127.0.0.1',
      port: 6379,
    },
  })
  client: ClientProxy;
  @Get('suggest/:baseUnit')
  async getSuggetion(@Param('baseUnit') baseUnit: string) {
    return  this.client.send("get-suggestion",baseUnit);
  }

  @Post('/add')
  async addConversionRete(
    @Body()
    body: {
      baseUnit: string;
      containerUnit: string;
      conversionRate: number;
    },
  ) {
    return  this.client.send("update-rate",body);
  }
}