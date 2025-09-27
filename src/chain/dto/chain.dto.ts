import { IsNotEmpty, IsString } from 'class-validator';
export interface ChainInfo {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  contractAddress: string;
  feeSettings: FeeSettings;
  tokens: Record<string, TokenInfoDto>;
}

class FeeSettings {
  baseFeeBps: number;
  maxFeeBps: number;
  minFeeUsd: number;
}

class TokenInfoDto {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}

export class GetChainsResponseDto {
  success: boolean;
  chains: ChainInfo[];
}

export class GetTokensParamsDto {
  @IsString()
  @IsNotEmpty()
  chainName: string;
}

export class GetChainTokensResponseDto {
  success: boolean;
  chainName: string;
  tokens: Record<string, TokenInfoDto>;
}
