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
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.client
      .send('get_stock_movements', {
        productId,
        activatedBy,
        startDate,
        endDate,
        page,
        limit,
      })
      .toPromise();
  }

  @Get('/csv')
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

  // @Get('/pdf')
  // async downloadPdf(
  //   @Res() res: Response,
  //   @Query('activatedBy') activatedBy?: string,
  // ) {
  //   const pdfBuffer = await this.client
  //     .send('export_pdf', { activatedBy })
  //     .toPromise();

  //   res.setHeader('Content-Type', 'application/pdf');
  //   res.setHeader(
  //     'Content-Disposition',
  //     'attachment; filename="stock_movements.pdf"',
  //   );
  //   res.send(pdfBuffer);
  // }

  @Get('/pdf')
  async downloadPdf(
    @Res() res: Response,
    @Query('activatedBy') activatedBy?: string,
  ) {
    try {
      // Log incoming query and activatedBy parameter
      console.log('Activated By:', activatedBy);

      // Generate PDF buffer
      const pdfBuffer = await this.client
        .send('export_pdf', { activatedBy })
        .toPromise();

      // Log PDF buffer details
      if (!pdfBuffer) {
        console.error('PDF buffer is empty or undefined');
        return res.status(500).send('Error generating PDF.');
      }

      console.log('PDF buffer size:', pdfBuffer.length);

      // Set headers for file download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename="stock_movements.pdf"',
      );

      // Send the PDF buffer to the client
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error while generating or sending PDF:', error);
      res.status(500).send('Internal server error while generating PDF.');
    }
  }

  @Get('/summary')
  async getInventorySummary(
    @Query('filter') filter?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    console.log('Fetching inventory summary...');
    return this.client.send('inventory.getSummary', { filter, page, limit });
  }
}


