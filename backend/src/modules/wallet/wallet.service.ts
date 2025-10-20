import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WalletService {
  constructor(private readonly configService: ConfigService) {}

  async getWalletBalance(address: string) {
    const apiKey = this.configService.get<string>('ETHERSCAN_API_KEY');
    if (!apiKey) {
      throw new Error('ETHERSCAN_API_KEY is not set');
    }

    // TODO: add other chains
    const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;

    try {
      const response = await axios.get(url);

      if (response.data.status !== '1') {
        throw new Error(`Etherscan API returned error: ${response.data.message}`);
      }

      return {
        address,
        balance: response.data.result
      };
    } catch (error) {
      throw new Error(`Etherscan API error: ${error.message}`);
    }
  }
}
