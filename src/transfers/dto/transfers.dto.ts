import {
  IsEthereumAddress,
  IsNotEmpty,
  IsString,
  Matches,
} from 'class-validator';

export class GetNonceQueryDto {
  @IsString()
  chainName: string;

  @IsEthereumAddress()
  userAddress: string;
}

export class GetNonceResponseDto {
  success: boolean;
  chainName: string;
  userAddress: string;
  nonce: number;
}

export class RelayTransferDto {
  @IsString()
  @IsNotEmpty()
  chainName: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid from address format' })
  from: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid to address format' })
  to: string;

  @IsString()
  @IsNotEmpty()
  tokenSymbol: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'Amount must be a valid integer string' })
  amount: string;

  @IsString()
  @IsNotEmpty()
  deadline: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^0x[a-fA-F0-9]{130}$/, { message: 'Invalid signature format' })
  signature: string;
}

export class RelayTransferResponseDto {
  success: boolean;
  transactionId: string;
  txHash: string;
  blockNumber: number;
  gasUsed: number;
  explorerUrl: string;
  fee: number;
  executionTime: number;
}
