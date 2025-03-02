import { Body, Controller ,Post} from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Client,ClientProxy,Transport } from "@nestjs/microservices";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";
import { ProductVariantDto } from "src/dto/create-variant.dto";
@Controller('variant')
export class ProductControllerVariant{
     constructor(
            @Inject('PRODUCT_SERVICE') private readonly unitConverionService: ClientProxy,
          ) {}
          @Client({
            transport: Transport.REDIS,
            options: {
              host: '127.0.0.1',
              port: 6379,
            },
          })
          client: ClientProxy;
          @Post('/add-variant')
          async createVariant(@Body() variantDto:ProductVariantDto){
                const newVariant={
                    productId:variantDto.productId,
                    size:variantDto.size,
                    color:variantDto.color,
                    weight:variantDto.weight,
                    price:variantDto.price
                }
                return this.client.send('variant-created',newVariant)
          }
}