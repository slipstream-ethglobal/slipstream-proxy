import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
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

  @Post('api/v1/relayer/relay')
  async relayTransaction(@Body() body) {
    // TODO: not doing any validation here
    return await this.newRelayerService.relayTransaction(body);
  }

  @Get('api/v1/relayer/fee/:chainId/:tokenSymbol/:amount')
  async getFeeEstimate(
    @Param('chainId') chainId: string,
    @Param('tokenSymbol') tokenSymbol: string,
    @Param('amount') amount: string,
  ) {
    // TODO: not doing any validation here
    return await this.newRelayerService.getFeeEstimate({
      chainId,
      tokenSymbol,
      amount,
    });
  }
}
