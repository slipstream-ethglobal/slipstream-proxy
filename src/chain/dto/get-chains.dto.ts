export interface ChainInfo {
  chainId: number;
  name: string;
  network: string;
  rpcUrl: string;
  blockExplorerUrl?: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  testnet: boolean;
  supported: boolean;
}

export class GetChainsResponseDto {
  chains: ChainInfo[];
  total: number;
}
