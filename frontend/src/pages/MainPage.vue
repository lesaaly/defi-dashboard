<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useWalletStore } from 'src/stores/wallet.store';

const walletStore = useWalletStore();

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

const carousel = ref(0);

const nftsCount = computed(() => walletStore.nftsCount);
const txCount = computed(() => walletStore.txCount);
const transactions = computed(() => walletStore.transactions);
const nftsPreview = computed(() => walletStore.nftsPreview);
const balanceUsd = computed(() => walletStore.balanceUsd);

onMounted(async () => {
  const address = '0x00000000219ab540356cbb839cbe05303d7705fa'; // временно
  await walletStore.fetchWalletData(address);
});
</script>

<template>
  <q-page class="q-pa-lg main_page">
    <div class="main_page_overview">
      <div class="text-title mb-m">Wallet Overview</div>

      <div class="overview-grid">
        <q-card flat bordered class="overview-card">
          <div class="overview-value">{{ nftsCount }}</div>
          <div class="overview-label">NFTs</div>
        </q-card>

        <q-card flat bordered class="overview-card">
          <div class="overview-value">{{ txCount }}</div>
          <div class="overview-label">Transactions</div>
        </q-card>

        <q-card flat bordered class="overview-card">
          <div class="overview-value">
            {{ balanceUsd ? `$${balanceUsd.toFixed(2)}` : '—' }}
          </div>
          <div class="overview-label">Balance (USD)</div>
        </q-card>
      </div>
    </div>

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
        autoplay
        animated
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
          <div v-if="nft.normalized_metadata?.image" class="nft-card">
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

.main_page_overview {
  background: $secondary;
  border-radius: 30px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .overview-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }

  .overview-card {
    background: transparent;
    border-radius: 20px;
    text-align: center;
    padding: 20px 0;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-3px);
    }

    .overview-value {
      font-size: 28px;
      font-weight: 600;
      color: $light;
    }

    .overview-label {
      font-size: 14px;
      color: $light-secondary;
      margin-top: 6px;
    }
  }
}
</style>
