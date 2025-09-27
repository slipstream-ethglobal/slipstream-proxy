/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, Logger } from '@nestjs/common';
import { HttpClientService } from 'src/common/services/http-client.service';
import { FeeEstimateResponse } from './dto/gas.dto';
import { HealthResponse, NewRelayerHealthResponse } from './dto/health.dto';

@Injectable()
export class NewRelayerService {
  private readonly logger = new Logger(NewRelayerService.name);

  constructor(private readonly httpClient: HttpClientService) {}

  async ping() {
    try {
      const response = await this.httpClient.get<HealthResponse>('/ping');
      return response;
    } catch (error) {
      this.handleError(error, 'ping relayer');
    }
  }

  async newRelayerPing() {
    try {
      const response = await this.httpClient.get<NewRelayerHealthResponse>(
        '/api/v1/relayer/ping',
      );
      return response;
    } catch (error) {
      this.handleError(error, 'new relayer ping');
    }
  }

  async relayTransaction(body: any) {
    try {
      const response = await this.httpClient.post<NewRelayerHealthResponse>(
        '/api/v1/relayer/relay',
        body,
      );
      return response;
    } catch (error) {
      this.handleError(error, 'relay transaction');
    }
  }

  async getFeeEstimate(params: {
    chainId: string;
    tokenSymbol: string;
    amount: string;
  }) {
    const { chainId, tokenSymbol, amount } = params;

    try {
      const response = await this.httpClient.get<FeeEstimateResponse>(
        `/api/v1/relayer/fee/${chainId}/${tokenSymbol}/${amount}`,
      );
      return response;
    } catch (error) {
      this.handleError(error, 'get fee estimate');
    }
  }

  private handleError(error: any, context: string): never {
    this.logger.error(`Failed to ${context}:`, error?.message || error);
    throw error;
  }
}
