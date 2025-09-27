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
  baseFeeBps: string;
  maxFeeBps: string;
  minFeeUsd: string;
}

class TokenInfoDto {
  address: string;
  symbol: string;
  name: string;
  decimals: string;
}

export class GetChainsResponseDto {
  success: boolean;
  chains: ChainInfo[];
}
