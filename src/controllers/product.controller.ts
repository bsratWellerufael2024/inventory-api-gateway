import { Body, Controller,Get, Post,Param,Query ,Delete,Patch, Req} from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Client,Transport,ClientProxy } from "@nestjs/microservices";
import { ProductDto } from "src/dto/create-product.dto";
import { UpdateProductDto } from "src/dto/update-product.dto";
@Controller('product')
export class ProductController {
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

  @Post('/add')
  async product(@Body() productDto: ProductDto) {
    const productData = {
      name: productDto.productName,
      specification: productDto.specification,
      openingQty: productDto.openingQty,
      baseUnit: productDto.baseUnit,
      cost_price: productDto.cost_price,
      selling_price: productDto.selling_price,
      category: productDto.category,
    };
    return this.client.send('product-created', productData);
  }

  @Get('detail/:id')
  async getProduct(@Param('id') id: number) {
    return this.client.send('get-one-product', id);
  }
  
  @Delete('/:productId')
  async deleteProduct(@Param('productId') productId: number) {
    return this.client.send('product-deleted', +productId);
  }
  @Patch(':id')
async updateProduct(
  @Param('id') productId: number,
  @Body() updateData: UpdateProductDto,
) {
  return this.client.send('product-updated', { productId, updateData });
}

}