import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class WalletService {
  constructor(private readonly configService: ConfigService) {}

  async getWalletBalance(address: string) {
    const apiKey = this.configService.get<string>('MORALIS_API_KEY');
    if (!apiKey) {
      throw new Error('MORALIS_API_KEY is not set');
    }

    const url = `https://deep-index.moralis.io/api/v2.2/${address}/balance?chain=eth`;

    try {
      const response = await axios.get(url, {
        headers: {
          'X-API-Key': apiKey,
        },
      });

      const balanceWei = response.data.balance;
      const balanceEth = Number(balanceWei) / 10 ** 18;

      return {
        address,
        balance: balanceEth,
      };
    } catch (error) {
      throw new Error(`Moralis API error: ${error.message}`);
    }
  }

  async getWalletTokens(address: string) {
    const apiKey = this.configService.get<string>('MORALIS_API_KEY');
    const url = `https://deep-index.moralis.io/api/v2.2/${address}/erc20?chain=eth`;

    try {
      const response = await axios.get(url, {
        headers: {
          'X-API-Key': apiKey,
        },
      });

      return response.data.map((token) => ({
        name: token.name,
        symbol: token.symbol,
        balance: (Number(token.balance) / 10 ** token.decimals).toFixed(4),
      }));
    } catch (error) {
      throw new Error(`Moralis API error: ${error.message}`);
    }
  }

  async getWalletTransactions(address: string) {
    const apiKey = this.configService.get<string>('MORALIS_API_KEY');
    const url = `https://deep-index.moralis.io/api/v2.2/${address}?chain=eth`;

    try {
      const response = await axios.get(url, {
        headers: {
          'X-API-Key': apiKey,
        },
      });

      return response.data.result;
    } catch (error) {
      throw new Error(`Moralis API error: ${error.message}`);
    }
  }

  async getWalletNFTs(address: string) {
    const apiKey = this.configService.get<string>('MORALIS_API_KEY');
    const url = `https://deep-index.moralis.io/api/v2.2/${address}/nft?chain=eth&format=decimal`;

    try {
      const response = await axios.get(url, {
        headers: {
          'X-API-Key': apiKey,
        },
      });

      return response.data.result;
    } catch (error) {
      throw new Error(`Moralis API error: ${error.message}`);
    }
  }

  async getWalletOverview(address: string) {
    const [balance, transactions, nfts] = await Promise.all([
      this.getWalletBalance(address),
      this.getWalletTransactions(address),
      this.getWalletNFTs(address),
    ]);

    return { address, balance, transactions, nfts };
  }
}
