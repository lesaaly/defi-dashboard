import { defineStore, acceptHMRUpdate } from 'pinia';
import api from 'src/api/api';
import { date } from 'quasar';

interface Transaction {
  hash: string;
  from_address: string;
  to_address: string;
  value: string;
  amount?: string;
  transaction_fee: string;
  block_timestamp?: string;
}

interface NFT {
  image?: string;
  name?: string;
  token_address?: string;
  token_id?: string;
  normalized_metadata?: {
    image?: string;
    name?: string;
  };
}

interface WalletState {
  currentAddress: string | null;
  balanceUsd: number | null;
  nfts: NFT[];
  transactions: Transaction[];
  isLoading: boolean;
  lastFetchTime: number | null;
  cacheTimeout: number; // время кеша в миллисекундах (5 минут)
}

export const useWalletStore = defineStore('wallet', {
  state: (): WalletState => ({
    currentAddress: null,
    balanceUsd: null,
    nfts: [],
    transactions: [],
    isLoading: false,
    lastFetchTime: null,
    cacheTimeout: 5 * 60 * 1000, // 5 минут
  }),

  getters: {
    nftsCount: (state) => state.nfts.length,
    txCount: (state) => state.transactions.length,
    nftsPreview: (state) => state.nfts.slice(0, 5),
    shouldRefresh: (state) => {
      if (!state.lastFetchTime) return true;
      return Date.now() - state.lastFetchTime > state.cacheTimeout;
    },
  },

  actions: {
    async fetchWalletData(address: string, forceRefresh = false) {
      // Если адрес не изменился и данные свежие, не делаем запрос
      if (
        !forceRefresh &&
        this.currentAddress === address &&
        !this.shouldRefresh
      ) {
        return;
      }

      // Если уже идет загрузка, не делаем повторный запрос
      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      this.currentAddress = address;

      try {
        const [balanceResponse, nftResponse, txResponse] = await Promise.all([
          api.get(`/wallets/${address}/balance`),
          api.get(`/wallets/${address}/nfts`),
          api.get(`/wallets/${address}/transactions`),
        ]);

        this.balanceUsd = balanceResponse.data.balanceUsd || null;

        if (Array.isArray(nftResponse.data)) {
          this.nfts = nftResponse.data;
        } else {
          this.nfts = [];
        }

        if (Array.isArray(txResponse.data)) {
          const formattedTransactions = txResponse.data.map((tx: Transaction) => ({
            ...tx,
            block_timestamp: tx.block_timestamp
              ? date.formatDate(tx.block_timestamp, 'DD.MM.YYYY')
              : '',
          }));
          this.transactions = formattedTransactions;
        } else {
          console.error('Транзакции не являются массивом:', txResponse.data);
          this.transactions = [];
        }

        this.lastFetchTime = Date.now();
      } catch (err) {
        console.error('Ошибка при загрузке данных кошелька:', err);
      } finally {
        this.isLoading = false;
      }
    },

    clearWalletData() {
      this.currentAddress = null;
      this.balanceUsd = null;
      this.nfts = [];
      this.transactions = [];
      this.lastFetchTime = null;
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useWalletStore, import.meta.hot));
}
