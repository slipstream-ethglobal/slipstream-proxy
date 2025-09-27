import { IsNotEmpty, IsString } from 'class-validator';

export class EstimateGasResponseDto {
  success: boolean;
  gasEstimate: number;
  gasPrice: number;
  gasCost: number;
}

export class GasPriceResponseDto {
  success: boolean;
  chainName: string;
  gasPrice: number;
  gasPriceWei: number;
}

export class GasCacheStatsResponseDto {
  success: boolean;
  size: number;
  entries: Array<{
    chain: string;
    price: number;
    age: number;
  }>;
}

export class GetGasParamsDto {
  @IsString()
  @IsNotEmpty()
  chainName: string;
}

export class GetPermitCheckParamsDto {
  @IsString()
  @IsNotEmpty()
  chainName: string;

  @IsString()
  @IsNotEmpty()
  tokenAddress: string;
}

export class PermitSupportResponseDto {
  success: boolean;
  supportsPermit: boolean;
}
