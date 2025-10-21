import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { WalletService } from "./wallet.service";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller('wallets')
export class WalletController {
  constructor(private walletService: WalletService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':address/overview')
  async getOverview(@Param('address') address: string) {
    return this.walletService.getWalletOverview(address);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':address/balance')
  async getBalance(@Param('address') address: string) {
    return this.walletService.getWalletBalance(address);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':address/tokens')
  async getTokens(@Param('address') address: string) {
    return this.walletService.getWalletTokens(address);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':address/transactions')
  async getTransactions(@Param('address') address: string) {
    return this.walletService.getWalletTransactions(address);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':address/nfts')
  async getNfts(@Param('address') address: string) {
    return this.walletService.getWalletNFTs(address);
  }
}