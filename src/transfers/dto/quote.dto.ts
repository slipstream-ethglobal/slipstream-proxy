import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class GetQuoteDto {
  @IsString()
  @IsNotEmpty()
  chainName: string;

  @IsString()
  @IsNotEmpty()
  tokenSymbol: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'Amount must be a valid integer string' })
  amount: string;
}

export class GetQuoteResponseDto {
  success: boolean;
  chainName: string;
  tokenSymbol: string;
  amount: number;
  fee: number;
  total: number;
  feePercentage: number;
  tokenDecimals: number;
}
