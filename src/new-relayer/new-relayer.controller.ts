import { Controller, Get, Logger } from '@nestjs/common';
import { NewRelayerService } from './new-relayer.service';

@Controller()
export class NewRelayerController {
  private readonly logger = new Logger(NewRelayerController.name);

  constructor(private readonly newRelayerService: NewRelayerService) {}

  @Get('/ping')
  async ping() {
    return await this.newRelayerService.ping();
  }

  @Get('api/v1/relayer/ping')
  async pingRelayer() {
    return await this.newRelayerService.newRelayerPing();
  }
}
