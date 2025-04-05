import { Controller, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Controller('stock-monitor')
export class StockMonitorController {
  @Client({
    transport: Transport.REDIS,
    options: {
      host: 'localhost',
      port: 6379,
      retryAttempts: 5,
      retryDelay: 3000,
    },
  })
  private client: ClientProxy;

  @Post('check-low-stock')
  checkLowStock(): Observable<any> {
    return this.client.send('check_low_stock', {}).pipe(
      map((response) => {
        if (!response) {
          throw new Error('No response received from the service');
        }
        console.log('Low stock check completed successfully');
        return response; // Return the response from the service
      }),
      catchError((err) => {
        console.error('Error in sending message:', err);
        throw err; // Rethrow the error to be handled by the caller
      }),
    );
  }
}
