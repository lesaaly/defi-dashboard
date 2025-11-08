<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from 'src/api/api';
import { date } from 'quasar';

interface Transaction {
  hash: string;
  from_address: string;
  to_address: string;
  value: string;
  amount?: string;
  transaction_fee: string;
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

const nftsCount = ref(0);
const txCount = ref(0);
const transactions = ref<Transaction[]>([]);

const columns = [
  { name: 'hash', label: 'Tx Hash', field: 'hash', align: 'center' as const },
  { name: 'value', label: 'Value (ETH)', field: 'value', align: 'center' as const },
  { name: 'fee', label: 'Fee (ETH)', field: 'transaction_fee', align: 'center' as const },
  { name: 'date', label: 'Date', field: 'block_timestamp', align: 'center' as const },
];

const truncateHash = (hash: string) => {
  if (!hash) return '';
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
};

const nftsPreview = ref<NFT[]>([]);
const carousel = ref(0);

onMounted(async () => {
  try {
    const address = '0xf977814e90da44bfa03b6295a0616a897441acec'; // временно
    // const { data: balanceData } = await api.get(`/wallets/${address}/balance`)
    const { data: nftData } = await api.get(`/wallets/${address}/nfts`);
    const { data: txData } = await api.get(`/wallets/${address}/transactions`);

    if (Array.isArray(nftData)) {
      nftsCount.value = nftData.length;
      nftsPreview.value = nftData.slice(0, 5);
      console.log('NFTs:', nftsPreview.value);
    }
    if (Array.isArray(txData)) {
      txCount.value = txData.length;
      txData.forEach((tx) => {
        tx.block_timestamp = date.formatDate(tx.block_timestamp, 'DD.MM.YYYY');
      });
      transactions.value = txData;
    } else {
      console.error('Транзакции не являются массивом:', txData);
      transactions.value = [];
    }
  } catch (err) {
    console.error('Ошибка при загрузке данных:', err);
    transactions.value = [];
  }
});
</script>

<template>
  <q-page class="q-pa-lg main_page">
    <div class=""></div>
    <div class="">
      <div class="text-title mb-m">Latest Transactions</div>
      <q-table
        :rows="transactions"
        :columns="columns"
        row-key="hash"
        flat
        bordered
        class="main_page_table basic-text"
        table-header-class="table-header"
        :rows-per-page-options="[4]"
      >
        <template v-slot:body-cell-hash="props">
          <q-td :props="props">
            <q-tooltip :offset="[-10, -10]" transition-duration="300" class="basic-text">{{
              props.row.hash
            }}</q-tooltip>
            <span class="cursor-pointer">{{ truncateHash(props.row.hash) }}</span>
          </q-td>
        </template>
      </q-table>
    </div>
    <div class="main_page_item_3">
      <q-carousel
        v-model="carousel"
        arrows
        navigation
        infinite
        swipeable
        class="nft-carousel"
        control-color="accent"
        height="100%"
      >
        <q-carousel-slide
          v-for="(nft, index) in nftsPreview"
          :key="index"
          :name="index"
          class="nft-slide"
        >
          <div class="nft-card">
            <div class="text-title mb-m text-center">
              {{ nft.normalized_metadata?.name || 'Unnamed NFT' }}
            </div>
            <q-img
              :src="nft.normalized_metadata?.image || 'https://placehold.co/300x300'"
              :alt="nft.normalized_metadata?.name || 'NFT'"
              fit="cover"
              class="nft-image"
            />
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-page>
</template>

<style lang="scss" scoped>
.main_page {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, 1fr);
  gap: 16px;

  &_item_3 {
    grid-column: 2;
    grid-row: 1 / 3;
  }

  &_box {
    background: $secondary;
  }
}

.q-table__card {
  background-color: $secondary;
  border-radius: 30px;
}

:deep(.table-header) {
  color: $light-secondary;
}

.nft-carousel {
  background: transparent;
  padding: 16px;
}

.nft-slide {
  padding: 0;
}

.nft-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  height: 90%;
  gap: 16px;

  .nft-image {
    margin-top: auto;
    margin-bottom: auto;
  }
}

.nft-image {
  border-radius: 20px;
  object-fit: contain;
}
</style>
