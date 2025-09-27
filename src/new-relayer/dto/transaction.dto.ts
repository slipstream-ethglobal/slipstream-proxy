export interface TransactionStatus {
  success: boolean;
  transactionHash: string;
  status: 'pending' | 'confirmed' | 'failed';
  confirmations: number;
  blockNumber?: number;
  gasUsed?: string;
  effectiveGasPrice?: string;
  timestamp: Date;
}

export interface RelayerInfoResponse {
  success: boolean;
  relayerAddress: string;
  supportedChains: {
    id: number;
    name: string;
    explorerUrl: string;
    tokens: {
      symbol: string;
      address: string;
      decimals: number;
      name: string;
    }[];
  }[];
  balances: {
    chainId: number;
    chainName: string;
    balance: string;
    currency: string;
  }[];
}

export interface SafetyLimitsResponse {
  success: boolean;
  chainId: number;
  chainName: string;
  feeSettings: {
    baseFeeBps: number;
    minFeeUsd: number;
    maxFeeBps: number;
  };
  message: string;
}

export interface NetworkStatusResponse {
  success: true;
  chainId: number;
  chainName: string;
  relayerBalance: string;
  relayerAddress: string;
  gaslessContract: string;
  status: string;
}
