import { Injectable, Logger } from '@nestjs/common';
import { HttpClientService } from 'src/common/services/http-client.service';
import { GetNonceQueryDto, GetNonceResponseDto } from './dto/transfers.dto';

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
}
