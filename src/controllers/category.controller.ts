import { Body, Controller, Delete, Get, Param, Post,Put} from "@nestjs/common";
import { ClientProxy,Client,Transport } from "@nestjs/microservices";
import { Inject } from "@nestjs/common";
import { CategoryDto } from "src/dto/create-category.dto";
import { Patch } from "@nestjs/common";
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
  async createCategory(@Body() categoryDto: CategoryDto) {
    const categoryData = {
      category: categoryDto.category,
      description: categoryDto.description,
    };
    return this.client.send('category-created', categoryData);
  }
  @Get('/all-categories')
  async fetchCategories(): Promise<string[]> {
    return this.client.send<string[]>('get_all_categories', {}).toPromise();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    return this.client.send('get_category_by_id', id).toPromise();
  }


  @Patch(':id') // <-- PATCH instead of PUT
  async updateCategory(
    @Param('id') id: number,
    @Body() updateData: Partial<{ category?: string; description?: string }>,
  ) {
    return this.client.send('update_category', { id, updateData });
  }

  @Delete(':categoryId')
  async deleteCategory(
    @Param('categoryId') categoryId: number,
  ): Promise<{ message: string }> {
    return this.client
      .send<{ message: string }>('delete_category', categoryId)
      .toPromise();
  }
}