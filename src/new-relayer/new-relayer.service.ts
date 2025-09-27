import { Injectable, Logger } from '@nestjs/common';
import { HttpClientService } from 'src/common/services/http-client.service';
import { HealthResponse } from './health.dto';

@Injectable()
export class NewRelayerService {
  private readonly logger = new Logger(NewRelayerService.name);
  constructor(private readonly httpClient: HttpClientService) {}

  async ping() {
    try {
      const response = await this.httpClient.get<HealthResponse>('/ping');

      return response;
    } catch (error) {
      this.logger.error('Failed to get ping from relayer: ', error);
      throw error;
    }
  }
}
