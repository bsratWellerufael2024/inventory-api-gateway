import { Body, Controller, Post } from "@nestjs/common";
import { ClientProxy,Client,Transport } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";
import { CategoryDto } from "src/dto/create-category.dto";
@Controller('category')
export class CategoryController {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly categoryService: ClientProxy,
  ) {}
  @Client({
    transport: Transport.REDIS,
    options: {
      host: '127.0.0.1',
      port: 6379,
    },
  })
  client: ClientProxy;
  @Post('/new')
  async createCategory(@Body() categoryDto:CategoryDto){
     const categoryData = {
       name: categoryDto.name,
       description:categoryDto.description
     };
     return  this.client.send('category-created',categoryData)
  }
}