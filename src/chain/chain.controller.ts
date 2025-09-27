import { Controller, Get, Logger, Param } from '@nestjs/common';
import { ChainService } from './chain.service';
import {
  GetChainsResponseDto,
  GetChainTokensResponseDto,
  GetTokensParamsDto,
} from './dto/get-chains.dto';

@Controller('chains')
export class ChainController {
  private readonly logger = new Logger(ChainController.name);

  constructor(private readonly chainService: ChainService) {}

  @Get()
  async getChains(): Promise<GetChainsResponseDto> {
    try {
      const result = await this.chainService.getChains();

      return result;
    } catch (error) {
      this.logger.error(`Failed to get chains: `, error);
      throw error;
    }
  }

  @Get(':chainName/tokens')
  async getChainTokens(
    @Param() params: GetTokensParamsDto,
  ): Promise<GetChainTokensResponseDto> {
    try {
      const result = await this.chainService.getChainTokens(params.chainName);

      return result;
    } catch (error) {
      this.logger.error(`Failed to get chain tokens: `, error);
      throw error;
    }
  }
}
