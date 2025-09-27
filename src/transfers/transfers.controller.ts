import { Controller, Get, Logger, Query } from '@nestjs/common';
import { GetNonceQueryDto, GetNonceResponseDto } from './dto/transfers.dto';
import { TransfersService } from './transfers.service';

@Controller()
export class TransfersController {
  private readonly logger = new Logger(TransfersController.name);
  constructor(private readonly transfersService: TransfersService) {}

  @Get('nonce')
  async getNonce(
    @Query() query: GetNonceQueryDto,
  ): Promise<GetNonceResponseDto> {
    try {
      const { chainName, userAddress } = query;
      const result = await this.transfersService.getUserNonce(
        chainName,
        userAddress,
      );

      return result;
    } catch (error) {
      this.logger.error('Error getting nonce: ', error);
      throw error;
    }
  }
}
