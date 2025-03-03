import { Body, Controller,Get, Post,Param,Query ,Delete,Patch} from "@nestjs/common";
import { Inject } from "@nestjs/common";
import { Client,Transport,ClientProxy } from "@nestjs/microservices";
import { ProductDto } from "src/dto/create-product.dto";
import { UsePipes,ValidationPipe } from "@nestjs/common";
import { FilterProductsDto } from "src/dto/filter-products.dto";
import { UpdateProductDto } from "src/dto/update-product.dto";
@Controller('product')
export class ProductController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly usersService: ClientProxy,
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
  @Get('/all-product')
  async getAllProduct() {
    return this.client.send('get-all-product', {});
  }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getFilteredProducts(@Query() filterDto: FilterProductsDto) {
    return this.client.send({ cmd: 'get_filtered_products' }, filterDto);
  }
  @Get('detail/:id')
  async getProduct(@Param('id') id: number) {
    return this.client.send('get-one-product', id);
  }
  @Delete('/:productName')
  async deleteProduct(@Param('productName') productName: string) {
    return this.client.send('product-deleted', productName);
  }
  @Patch(':id')
  async updateProduct(
    @Param('id') productId: number,
    @Body() updateData: UpdateProductDto,
  ) {
    return this.client.emit("product-updated",{productId,updateData})
  }
 
}