import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetQuoteDto, GetQuoteResponseDto } from './dto/quote.dto';
import {
  GetNonceQueryDto,
  GetNonceResponseDto,
  RelayTransferDto,
  RelayTransferResponseDto,
} from './dto/transfers.dto';
import { TransfersService } from './transfers.service';

@Controller()
export class TransfersController {
  constructor(private readonly transfersService: TransfersService) {}

  @Get('nonce')
  async getNonce(
    @Query() query: GetNonceQueryDto,
  ): Promise<GetNonceResponseDto> {
    return await this.transfersService.getUserNonce(query);
  }

  @Post('quote')
  async getQuote(@Body() body: GetQuoteDto): Promise<GetQuoteResponseDto> {
    return await this.transfersService.getQuote(body);
  }

  @Post('relay-transfer')
  async relayTransfer(
    @Body() body: RelayTransferDto,
  ): Promise<RelayTransferResponseDto> {
    return await this.transfersService.relayTransfer(body);
  }
}
