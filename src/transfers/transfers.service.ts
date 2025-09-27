import { Injectable, Logger } from '@nestjs/common';
import { HttpClientService } from 'src/common/services/http-client.service';
import {
  EstimateGasResponseDto,
  GasCacheStatsResponseDto,
  GasPriceResponseDto,
} from './dto/gas.dto';
import { GetQuoteDto, GetQuoteResponseDto } from './dto/quote.dto';
import { PrepareSignatureDto } from './dto/signature.dto';
import {
  GetNonceQueryDto,
  GetNonceResponseDto,
  RelayTransferDto,
  RelayTransferResponseDto,
} from './dto/transfers.dto';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);

  constructor(private readonly httpClient: HttpClientService) {}

  async getUserNonce(query: GetNonceQueryDto): Promise<GetNonceResponseDto> {
    try {
      const response = await this.httpClient.get<GetNonceResponseDto>(
        '/nonce',
        query,
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to fetch chains from relayer: ', error);
      throw error;
    }
  }

  async getQuote(body: GetQuoteDto): Promise<GetQuoteResponseDto> {
    try {
      const response = await this.httpClient.post<GetQuoteResponseDto>(
        '/quote',
        body,
      );

      return response;
    } catch (error) {
      this.logger.error('Error getting quote: ', error);
      throw error;
    }
  }

  async relayTransfer(
    body: RelayTransferDto,
  ): Promise<RelayTransferResponseDto> {
    try {
      const response = await this.httpClient.post<RelayTransferResponseDto>(
        '/relay-transfer',
        body,
      );

      return response;
    } catch (error) {
      this.logger.error('Error while relay transfer: ', error);
      throw error;
    }
  }

  async estimateGas(
    body: PrepareSignatureDto,
  ): Promise<EstimateGasResponseDto> {
    try {
      const response = await this.httpClient.post<EstimateGasResponseDto>(
        '/estimate-gas',
        body,
      );

      return response;
    } catch (error) {
      this.logger.error('Error estimating gas: ', error);
      throw error;
    }
  }

  async getGasPrice(chainName: string): Promise<GasPriceResponseDto> {
    try {
      const response = await this.httpClient.post<GasPriceResponseDto>(
        '/gas-price/' + chainName,
      );

      return response;
    } catch (error) {
      this.logger.error(`Error getting gas price for ${chainName}: `, error);
      throw error;
    }
  }

  async getGasCacheStats(): Promise<GasCacheStatsResponseDto> {
    try {
      const response =
        await this.httpClient.get<GasCacheStatsResponseDto>('/gas-cache-stats');

      return response;
    } catch (error) {
      this.logger.error(`Error getting gas cache: `, error);
      throw error;
    }
  }
}
