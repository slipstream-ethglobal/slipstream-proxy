import { Injectable, Logger } from '@nestjs/common';
import { HttpClientService } from 'src/common/services/http-client.service';
import { GetNonceResponseDto } from './dto/transfers.dto';

@Injectable()
export class TransfersService {
  private readonly logger = new Logger(TransfersService.name);

  constructor(private readonly httpClient: HttpClientService) {}

  async getUserNonce(
    chainName: string,
    userAddress: string,
  ): Promise<GetNonceResponseDto> {
    try {
      const params = {
        chainName,
        userAddress,
      };

      const response = await this.httpClient.get<GetNonceResponseDto>(
        '/nonce',
        params,
      );

      return response;
    } catch (error) {
      this.logger.error('Failed to fetch chains from relayer: ', error);
      throw error;
    }
  }
}
