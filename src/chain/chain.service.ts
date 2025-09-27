import { Injectable, Logger } from '@nestjs/common';
import { HttpClientService } from '../common/services/http-client.service';
import {
  GetChainsResponseDto,
  GetChainTokensResponseDto,
} from './dto/chain.dto';

@Injectable()
export class ChainService {
  private readonly logger = new Logger(ChainService.name);

  constructor(private readonly httpClient: HttpClientService) {}

  async getChains(): Promise<GetChainsResponseDto> {
    try {
      const response =
        await this.httpClient.get<GetChainsResponseDto>('/chains');

      return response;
    } catch (error) {
      this.logger.error('Failed to fetch chains from relayer: ', error);
      throw error;
    }
  }

  async getChainTokens(chainName: string): Promise<GetChainTokensResponseDto> {
    try {
      const response = await this.httpClient.get<GetChainTokensResponseDto>(
        '/chains/' + chainName + '/tokens',
      );

      return response;
    } catch (error) {
      this.logger.error(
        `Failed to fetch tokens for the chain ${chainName} from relayer: `,
        error,
      );
      throw error;
    }
  }
}
