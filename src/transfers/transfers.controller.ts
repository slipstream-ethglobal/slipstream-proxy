import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  EstimateGasResponseDto,
  GasCacheStatsResponseDto,
  GasPriceResponseDto,
  GetGasParamsDto,
  GetPermitCheckParamsDto,
  PermitSupportResponseDto,
} from './dto/gas.dto';
import { GetQuoteDto, GetQuoteResponseDto } from './dto/quote.dto';
import { PrepareSignatureDto } from './dto/signature.dto';
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

  @Post('process-standard-gasless-transfer')
  async processStandardGaslessTransfer(
    @Body() body: RelayTransferDto,
  ): Promise<RelayTransferResponseDto> {
    return await this.transfersService.processStandardGaslessTransfer(body);
  }

  @Post('process-permit-gasless-transfer')
  async processPermitBasedGaslessTransfer(
    @Body() body: RelayTransferDto,
  ): Promise<RelayTransferResponseDto> {
    return await this.transfersService.processPermitBasedGaslessTransfer(body);
  }

  @Get('check-permit-support/:chainName/:tokenAddress')
  async checkPermitSupport(
    @Param() params: GetPermitCheckParamsDto,
  ): Promise<PermitSupportResponseDto> {
    return await this.transfersService.checkPermitSupport(params);
  }

  @Post('estimate-gas')
  async estimateGas(
    @Body() body: PrepareSignatureDto,
  ): Promise<EstimateGasResponseDto> {
    return await this.transfersService.estimateGas(body);
  }

  @Post('gas-price/:chainName')
  async getGasPrice(
    @Param() params: GetGasParamsDto,
  ): Promise<GasPriceResponseDto> {
    return await this.transfersService.getGasPrice(params.chainName);
  }

  @Get('gas-cache-stats')
  async getGasCacheStats(): Promise<GasCacheStatsResponseDto> {
    return await this.transfersService.getGasCacheStats();
  }
}
