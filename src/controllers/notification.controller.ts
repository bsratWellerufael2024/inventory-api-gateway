import { Controller } from "@nestjs/common";
import { Post,Body } from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Client,ClientProxy ,Transport} from "@nestjs/microservices";
@Controller('email')
export class NotificationController {
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


  @Post('test-email')
  
  async sendTestEmail(
    @Body() body: { to: string; productName: string; stock: number },
  ) {
    const result = await this.client
      .send(
        { cmd: 'low_stock_alert' },
        {
          to: body.to,
          productName: body.productName,
          stock: body.stock,
        },
      )
      .toPromise();

    return {
      message: 'Request sent to inventory-service',
      result,
    };
  }
}