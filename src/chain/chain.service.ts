import { Injectable, Logger } from '@nestjs/common';
import { HttpClientService } from '../common/services/http-client.service';
import { GetChainsResponseDto } from './dto/get-chains.dto';

@Injectable()
export class ChainService {
  private readonly logger = new Logger(ChainService.name);

  constructor(private readonly httpClient: HttpClientService) {}

  async getChains(): Promise<GetChainsResponseDto> {
    try {
      const response =
        await this.httpClient.get<GetChainsResponseDto>('/chains');

      this.logger.log(
        `Retrieved ${response.chains.length} chains from relayer`,
      );
      return response;
    } catch (error) {
      this.logger.error('Failed to fetch chains from relayer', error);
      throw error;
    }
  }
}
