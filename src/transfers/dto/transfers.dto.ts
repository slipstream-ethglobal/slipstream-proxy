import { IsEthereumAddress, IsString } from 'class-validator';

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
