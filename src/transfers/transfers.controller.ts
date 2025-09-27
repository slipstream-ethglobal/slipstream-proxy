import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { GetQuoteDto, GetQuoteResponseDto } from './dto/quote.dto';
import { GetNonceQueryDto, GetNonceResponseDto } from './dto/transfers.dto';
import { TransfersService } from './transfers.service';

@Controller()
export class TransfersController {
  private readonly logger = new Logger(TransfersController.name);
  constructor(private readonly transfersService: TransfersService) {}

  @Get('nonce')
  async getNonce(
    @Query() query: GetNonceQueryDto,
  ): Promise<GetNonceResponseDto> {
    try {
      const result = await this.transfersService.getUserNonce(query);

      return result;
    } catch (error) {
      this.logger.error('Error getting nonce: ', error);
      throw error;
    }
  }

  @Post('quote')
  async getQuote(@Body() body: GetQuoteDto): Promise<GetQuoteResponseDto> {
    try {
      const result = await this.transfersService.getQuote(body);

      return result;
    } catch (error) {
      this.logger.error('Error getting quote: ', error);
      throw error;
    }
  }
}
