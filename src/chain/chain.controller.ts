/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, Logger, Request } from '@nestjs/common';
import { ChainService } from './chain.service';
import { GetChainsResponseDto } from './dto/get-chains.dto';

@Controller('chains')
export class ChainController {
  private readonly logger = new Logger(ChainController.name);

  constructor(private readonly chainService: ChainService) {}

  @Get()
  async getChains(@Request() request: Request): Promise<GetChainsResponseDto> {
    const requestId = (request as any).requestId;

    try {
      const result = await this.chainService.getChains();

      this.logger.log(
        `[${requestId}] Successfully retrieved ${result.chains.length} chains`,
      );
      return result;
    } catch (error) {
      this.logger.error(`[${requestId}] Failed to get chains:`, error);
      throw error;
    }
  }
}
