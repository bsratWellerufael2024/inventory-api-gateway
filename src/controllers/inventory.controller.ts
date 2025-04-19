import { Controller,Post,Body,Get} from "@nestjs/common";
import { RecordStockMovementDto } from "src/dto/record-stock-movement.dto";
import { Inject } from "@nestjs/common";
import { ClientProxy,Client,Transport} from "@nestjs/microservices";
import { Query } from "@nestjs/common";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/guards/jwt-auth.guard";
import { Request } from "@nestjs/common";
import { Res } from "@nestjs/common";
import { Response } from 'express';
import { lastValueFrom } from "rxjs";

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

  @UseGuards(AuthGuard)
  @Post('/record-movement')
  async recordStockMovement(
    @Body() dto: RecordStockMovementDto,
    @Request() req: any,
  ) {
    const username = req.user?.username;
    if (!username) {
      throw new Error('Username is missing!');
    }
    const enhancedDto = { ...dto, activatedBy: username };
    return this.client.send('movement_recorded', enhancedDto);
  }

  @Get('/stock-movements')
  async getStockMovements(
    @Request() req: any,
    @Query('productId') productId?: number,
    @Query('activatedBy') activatedBy?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('timeRange') timeRange?: 'daily' | 'weekly' | 'monthly' | 'yearly', // ✅ Add this
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 100,
  ) {
    return this.client
      .send('get_stock_movements', {
        productId,
        activatedBy,
        startDate,
        endDate,
        timeRange,
        page,
        limit,
      })
      .toPromise();
  }


  @Get('summary')
  async getInventorySummary(
    @Query('filter') filter?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 100,
  ) {
    const payload = {
      filter,
      page: Number(page),
      limit: Number(limit),
    };

    const result = await lastValueFrom(
      this.client.send('inventory.getSummary', payload),
    );

    return {
      success: true,
      message: 'Inventory summary fetched successfully',
      data: result,
    };
  }

  @Get('stock-movements/csv')
  async downloadCsv(
    @Res() res: Response,
    @Query('activatedBy') activatedBy?: string,
  ) {
    const csvData = await this.client
      .send('export_csv', { activatedBy })
      .toPromise();

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="stock_movements.csv"',
    );
    res.send(csvData);
  }

  @Get('stock-movements/pdf')
  async downloadStockMovementsPdf(
    @Query('activatedBy') activatedBy: string,
    @Res() res: Response,
  ) {
    console.log('Activated By:', activatedBy);

    const response = await this.client
      .send('generate-stock-movement-pdf', { activatedBy })
      .toPromise();

    const buffer = Buffer.from(response.pdf, 'base64');
    console.log('PDF buffer size:', buffer.length);

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=stock-movements.pdf',
      'Content-Length': buffer.length,
    });

    res.end(buffer); // Now this will work
  }

  @Get('inventory-summary-pdf')
  async downloadInventorySummary(@Res({ passthrough: false }) res: Response) {
    const bufferLikeObject = await this.client
      .send('export_inventory_summary_pdf', {})
      .toPromise();

    const realBuffer = Buffer.from(bufferLikeObject.data); // convert back to Buffer

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="inventory-summary.pdf"',
      'Content-Length': realBuffer.length,
    });

    res.end(realBuffer);
  }

  @Get('inventory-summary-csv')
  async downloadInventorySummaryCSV(
    @Res({ passthrough: false }) res: Response,
  ) {
    const bufferLikeObject = await this.client
      .send('export_inventory_summary_csv', {})
      .toPromise();

    const realBuffer = Buffer.from(bufferLikeObject.data); // extract and convert if needed

    res.set({
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="inventory-summary.csv"',
      'Content-Length': realBuffer.length,
    });

    res.end(realBuffer); // ✅ Only send Buffer, not object
  }
}


